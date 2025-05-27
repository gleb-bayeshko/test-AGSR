export interface UserPayload {
  id: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserPayload;
}

export interface ErrorResponse {
  error: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueAt: string | null;
  listId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
