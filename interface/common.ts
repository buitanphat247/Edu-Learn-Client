export interface Comment {
  id: string | number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  replies?: Comment[];
}

