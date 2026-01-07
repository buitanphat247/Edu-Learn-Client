"use client";

import io from "socket.io-client";

type SocketInstance = ReturnType<typeof io>;

/**
 * Socket client cho Friend namespace (/friends)
 * Tách biệt với socket client chính để handle friend-specific events
 */
class FriendSocketClient {
  private socket: SocketInstance | null = null;
  private isConnecting = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  /**
   * Get socket server URL from environment or use default
   */
  private getSocketUrl(): string {
    if (typeof window === "undefined") return "";
    
    // Try to get from environment variable
    const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (envUrl) {
      return envUrl;
    }

    // Default: same origin as API, but on socket.io path
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1611";
    return apiUrl.replace("/api", "");
  }

  /**
   * Get user ID for socket connection
   */
  private getUserId(): number | string | null {
    if (typeof window === "undefined") return null;
    
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.user_id || null;
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }

    return null;
  }

  /**
   * Get access token from localStorage or cookie
   */
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Try localStorage first
    const token = localStorage.getItem("accessToken");
    if (token) return token;

    // Try to get from user cookie
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.access_token || null;
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }

    // Try to get from cookie
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
          return decodeURIComponent(value);
        }
      }
    } catch (error) {
      console.error("Error getting token from cookie:", error);
    }

    return null;
  }

  /**
   * Connect to /friends namespace
   */
  connect(): SocketInstance | null {
    // Return existing connection if available
    if (this.socket?.connected) {
      return this.socket;
    }

    // Prevent multiple connection attempts
    if (this.isConnecting) {
      return this.socket;
    }

    const socketUrl = this.getSocketUrl();
    if (!socketUrl) {
      console.warn("Socket URL not configured");
      return null;
    }

    const userId = this.getUserId();
    const token = this.getAccessToken();
    
    if (!userId) {
      console.warn("No user ID found. Friend socket connection requires user ID.");
      return null;
    }

    this.isConnecting = true;

    try {
      // Connect to /friends namespace with auth token and userId
      // auth.token: JWT token for authentication
      // query.userId: Fallback userId (for backward compatibility)
      this.socket = io(`${socketUrl}/friends`, {
        auth: {
          token: token || undefined, // JWT token
          user_id: userId, // Also send userId in auth for convenience
        },
        query: {
          userId: String(userId), // Fallback for backward compatibility
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("Friend socket connected:", this.socket?.id);
        this.isConnecting = false;

        // Notify all listeners
        this.connectionListeners.forEach((listener) => listener(true));
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("Friend socket disconnected:", reason);
        this.isConnecting = false;
        
        // Notify all listeners
        this.connectionListeners.forEach((listener) => listener(false));
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("Friend socket connection error:", error);
        this.isConnecting = false;
        
        // Notify all listeners
        this.connectionListeners.forEach((listener) => listener(false));
      });

    } catch (error) {
      console.error("Error creating friend socket connection:", error);
      this.isConnecting = false;
      return null;
    }

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): SocketInstance | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);
    
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  /**
   * Emit event to server
   */
  emit(event: string, data: any): void {
    if (!this.socket || !this.socket.connected) {
      console.warn(`Cannot emit ${event}: Friend socket not connected`);
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Listen to event from server
   */
  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.socket) {
      console.warn(`Cannot listen to ${event}: Friend socket not initialized`);
      return () => {};
    }

    this.socket.on(event, callback);

    // Return unsubscribe function
    return () => {
      if (this.socket) {
        this.socket.off(event, callback);
      }
    };
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

// Export singleton instance
export const friendSocketClient = new FriendSocketClient();

