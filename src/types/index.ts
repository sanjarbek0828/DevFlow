export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  listId: string;
  tagIds: string[]; // JSON stringified array in DB, parsed here
  priority: Priority;
  dueDate: string | null; // ISO string
  reminderAt: string | null; // ISO string
  isCompleted: boolean;
  completedAt: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  subtasks: Subtask[]; // JSON stringified in DB
  repeatRule?: string | null;
}

export interface List {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
