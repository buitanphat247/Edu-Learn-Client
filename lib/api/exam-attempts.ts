import axios from "axios";

// AI Python Tool URL
const AI_API_URL = "http://localhost:5000";

export interface AttemptLog {
  attempt_id: string;
  started_at: string;
  expires_at: string;
  status: string;
  resumed?: boolean;
  answers?: Record<string, string>;
  violation_count?: number;
}

export const startExamAttempt = async (
  ragTestId: string,
  classId: number | string,
  studentId: number | string,
  mode: "practice" | "official" = "practice"
): Promise<AttemptLog> => {
  try {
    const response = await axios.post(`${AI_API_URL}/api/exams/attempt/start`, {
      rag_test_id: ragTestId,
      class_id: Number(classId),
      student_id: Number(studentId),
      mode,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return backend error message
      throw new Error(error.response.data?.error || "Lỗi khởi tạo bài thi");
    }
    console.error("Error starting exam attempt:", error);
    throw new Error("Lỗi kết nối đến hệ thống thi");
  }
};

export const submitExamAttempt = async (
  attemptId: string,
  studentId: number | string,
  answers: Record<string, string>
): Promise<{ score: number; max_score: number } | null> => {
  try {
    const response = await axios.post(`${AI_API_URL}/api/exams/attempt/submit`, {
      attempt_id: attemptId,
      student_id: Number(studentId),
      answers,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting exam:", error);
    return null;
  }
};

export const logSecurityEvent = async (attemptId: string, eventType: string, details?: string): Promise<boolean> => {
  try {
    await axios.post(`${AI_API_URL}/api/exams/security/log`, {
      attempt_id: attemptId,
      event_type: eventType,
      details,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export interface StudentAttempt {
  id: string;
  student_id: number;
  student_name: string;
  status: "in_progress" | "submitted" | "expired";
  score: number;
  started_at: string;
  submitted_at: string | null;
  answered_count: number;
  security: {
    reload: number;
    tab_hidden: number;
    disconnect: number;
    logs: {
      type: string;
      timestamp: string;
      details: string | null;
    }[];
  };
}

export const getTestAttempts = async (testId: string): Promise<StudentAttempt[]> => {
  try {
    const response = await axios.get(`${AI_API_URL}/api/exams/test/${testId}/attempts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test attempts:", error);
    return [];
  }
};
