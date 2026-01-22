"use client";

import io from "socket.io-client";

type SocketInstance = ReturnType<typeof io>;

/**
 * Socket client for Class namespace (/class)
 */
class ClassSocketClient {
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

    try {
      // Import from cookies utility
      const { getUserIdFromCookie } = require("@/lib/utils/cookies");
      const userId = getUserIdFromCookie();
      if (userId) return userId;

      // Fallback to localStorage for compatibility
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.user_id) return user.user_id;
        if (user.id) return user.id;
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
    return null;
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Check localStorage first
    const token = localStorage.getItem("accessToken");
    if (token) return token;

    // Check cookies
    try {
      const { getCookie } = require("@/lib/utils/cookies");
      const cookieToken = getCookie("accessToken");
      if (cookieToken) return cookieToken;
    } catch (e) {}

    return null;
  }

  connect(): SocketInstance | null {
    if (this.socket?.connected) return this.socket;
    if (this.isConnecting) return this.socket;

    const socketUrl = this.getSocketUrl();
    if (!socketUrl) return null;

    const userId = this.getUserId();
    const token = this.getAccessToken();

    if (!userId) return null;

    this.isConnecting = true;

    try {
      this.socket = io(`${socketUrl}/class`, {
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

      this.socket.on("connect", () => {
        console.log("Class socket connected:", this.socket?.id);
        this.isConnecting = false;
        this.connectionListeners.forEach((listener) => listener(true));
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("Class socket disconnected:", reason);
        this.isConnecting = false;
        this.connectionListeners.forEach((listener) => listener(false));
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("Class socket connection error:", error);
        this.isConnecting = false;
        this.connectionListeners.forEach((listener) => listener(false));
      });
    } catch (error) {
      console.error("Error creating class socket connection:", error);
      this.isConnecting = false;
      return null;
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  getSocket(): SocketInstance | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  emit(event: string, data: any): void {
    if (!this.socket) this.connect();
    if (this.socket) this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.socket) this.connect();
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

  // Helper method specifically for class updates
  joinClass(classId: string | number) {
    this.emit("join_class", { class_id: classId });
  }

  leaveClass(classId: string | number) {
    this.emit("leave_class", { class_id: classId });
  }
}

export const classSocketClient = new ClassSocketClient();
