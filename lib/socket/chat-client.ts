"use client";

import io from "socket.io-client";

type SocketInstance = ReturnType<typeof io>;

/**
 * Socket client cho Chat namespace (/chat)
 */
class ChatSocketClient {
  private socket: SocketInstance | null = null;
  private isConnecting = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

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

  private getUserId(): number | string | null {
    if (typeof window === "undefined") return null;

    // Try localStorage first
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.user_id) return user.user_id;
        if (user.id) return user.id;
      }
    } catch (error) {
      console.error("Error getting user ID from localStorage:", error);
    }

    // Try cookie
    try {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "user_id") {
          return decodeURIComponent(value);
        }
      }
    } catch (e) {}

    return null;
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    // Try localStorage first
    const token = localStorage.getItem("accessToken");
    if (token) return token;

    // Try to get from cookie
    try {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "accessToken") {
          return decodeURIComponent(value);
        }
      }
    } catch (error) {
      console.error("Error getting token from cookie:", error);
    }

    return null;
  }

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
      console.warn("No user ID found. Chat socket connection requires user ID.");
      return null;
    }

    this.isConnecting = true;

    try {
      // Connect to /chat namespace
      this.socket = io(`${socketUrl}/chat`, {
        auth: {
          token: token || undefined,
          user_id: userId,
        },
        query: {
          userId: String(userId),
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("Chat socket connected:", this.socket?.id);
        this.isConnecting = false;

        // Notify all listeners
        this.connectionListeners.forEach((listener) => listener(true));
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("Chat socket disconnected:", reason);
        this.isConnecting = false;

        // Notify all listeners
        this.connectionListeners.forEach((listener) => listener(false));
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("Chat socket connection error:", error);
        this.isConnecting = false;

        // Notify all listeners
        this.connectionListeners.forEach((listener) => listener(false));
      });
    } catch (error) {
      console.error("Error creating chat socket connection:", error);
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

    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  emit(event: string, data: any): void {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.socket) {
      this.connect();
    }

    // Wait for socket to be initialized
    if (this.socket) {
      this.socket.on(event, callback);
      return () => {
        this.socket?.off(event, callback);
      };
    }
    return () => {};
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

export const chatSocketClient = new ChatSocketClient();
