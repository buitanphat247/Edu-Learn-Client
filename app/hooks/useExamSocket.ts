import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// In production, this should come from env or config
const SOCKET_URL = "http://localhost:5000";

interface UseExamSocketProps {
  examId: string;
  studentId: string; // Ideally this comes from auth context, but passing it for now
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useExamSocket = ({ examId, studentId, onConnect, onDisconnect }: UseExamSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!examId || !studentId) return;

    // Initialize Socket
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);
      setIsConnected(true);
      
      // Join the specific exam room
      socket.emit("join_exam", { examId, studentId });
      
      if (onConnect) onConnect();
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
      if (onDisconnect) onDisconnect();
    });

    socket.on("join_success", (data) => {
        console.log("Exam Joined:", data);
    });
    
    socket.on("violation_recorded", (data) => {
        console.log("Violation Ack:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, [examId, studentId]); // Re-connect if IDs change

  const reportViolation = useCallback((type: string, message: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("report_violation", {
        examId,
        studentId,
        type,
        message
      });
    } else {
        console.warn("Socket not connected, cannot report violation:", type);
    }
  }, [examId, studentId, isConnected]);

  return {
    socket: socketRef.current,
    isConnected,
    reportViolation
  };
};
