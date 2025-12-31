import type { NotificationResponse } from "@/lib/api/notifications";

export interface Notification {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  time?: string;
  scope: string;
}

export interface Document {
  id: string;
  title: string;
  size: string;
  date: string;
  type: string;
  iconColor: string;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  format: string;
  subject: string;
  subjectColor: string;
}

export interface Exercise {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  iconColor: string;
  dueDate: string;
  dueTime: string;
  submitted: number;
  total: number;
  graded: number;
  status: "open" | "closed" | "completed";
  closedDate?: string;
}

export interface ClassTabProps {
  classId: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface ClassNotificationsTabProps extends ClassTabProps {
  onNotificationCreated?: () => void;
}

export interface CreateClassNotificationModalProps {
  open: boolean;
  classId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export interface EditClassNotificationModalProps {
  open: boolean;
  notification: NotificationResponse | null;
  classId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

