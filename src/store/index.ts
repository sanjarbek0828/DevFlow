import { create } from 'zustand';
import { Task, List, Tag } from '../types';
import { db } from '../db';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  tasks: Task[];
  lists: List[];
  tags: Tag[];
  fetchData: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'completedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  addList: (list: Omit<List, 'id'>) => Promise<void>;
  addTag: (tag: Omit<Tag, 'id'>) => Promise<void>;
}

const parseJSON = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const useStore = create<AppState>((set, get) => ({
  tasks: [],
  lists: [],
  tags: [],

  fetchData: async () => {
    try {
      const listsRes = await db.execute('SELECT * FROM lists ORDER BY list_order ASC');
      let lists = (listsRes.rows || []).map((r: any) => ({ ...r, order: r.list_order }));
      
      // Ensure default list exists
      if (lists.length === 0) {
        const defaultList = { id: 'default', name: 'Inbox', color: '#3b82f6', icon: 'inbox', order: 0 };
        await db.execute(
          'INSERT INTO lists (id, name, color, icon, list_order) VALUES (?, ?, ?, ?, ?)',
          [defaultList.id, defaultList.name, defaultList.color, defaultList.icon, defaultList.order]
        );
        lists = [defaultList];
      }

      const tagsRes = await db.execute('SELECT * FROM tags');
      const tags = (tagsRes.rows || []) as unknown as Tag[];

      const tasksRes = await db.execute('SELECT * FROM tasks ORDER BY createdAt DESC');
      const tasks = (tasksRes.rows || []).map((r: any) => ({
        ...r,
        isCompleted: !!r.isCompleted,
        tagIds: parseJSON(r.tagIds, []),
        subtasks: parseJSON(r.subtasks, []),
      }));

      set({ lists, tags, tasks });
    } catch (e) {
      console.error('fetchData error', e);
    }
  },

  addTask: async (taskData) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newTask: Task = {
      id,
      ...taskData,
      isCompleted: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.execute(
        'INSERT INTO tasks (id, title, description, listId, tagIds, priority, dueDate, reminderAt, isCompleted, completedAt, createdAt, updatedAt, subtasks, repeatRule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newTask.id, newTask.title, newTask.description, newTask.listId, JSON.stringify(newTask.tagIds),
          newTask.priority, newTask.dueDate, newTask.reminderAt, 0, null, newTask.createdAt, newTask.updatedAt,
          JSON.stringify(newTask.subtasks), newTask.repeatRule || null
        ]
      );
      set((_state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (e) {
      console.error('addTask error', e);
    }
  },

  updateTask: async (id, updates) => {
    const now = new Date().toISOString();
    const state = get();
    const existing = state.tasks.find(t => t.id === id);
    if (!existing) return;

    const updatedTask = { ...existing, ...updates, updatedAt: now };
    
    try {
      await db.execute(
        'UPDATE tasks SET title=?, description=?, listId=?, tagIds=?, priority=?, dueDate=?, reminderAt=?, isCompleted=?, completedAt=?, updatedAt=?, subtasks=?, repeatRule=? WHERE id=?',
        [
          updatedTask.title, updatedTask.description, updatedTask.listId, JSON.stringify(updatedTask.tagIds),
          updatedTask.priority, updatedTask.dueDate, updatedTask.reminderAt, updatedTask.isCompleted ? 1 : 0, 
          updatedTask.completedAt, updatedTask.updatedAt, JSON.stringify(updatedTask.subtasks), updatedTask.repeatRule || null,
          id
        ]
      );
      set((_state) => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t)
      }));
    } catch (e) {
      console.error('updateTask error', e);
    }
  },

  deleteTask: async (id) => {
    try {
      await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
      set((_state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    } catch (e) {
      console.error('deleteTask error', e);
    }
  },

  toggleTaskStatus: async (id) => {
    const state = get();
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const isCompleted = !task.isCompleted;
    const completedAt = isCompleted ? new Date().toISOString() : null;

    try {
      await db.execute(
        'UPDATE tasks SET isCompleted = ?, completedAt = ? WHERE id = ?',
        [isCompleted ? 1 : 0, completedAt, id]
      );
      set((_state) => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, isCompleted, completedAt } : t
        )
      }));
    } catch (e) {
      console.error('toggleTaskStatus error', e);
    }
  },

  addList: async (listData) => {
    const id = uuidv4();
    try {
      await db.execute(
        'INSERT INTO lists (id, name, color, icon, list_order) VALUES (?, ?, ?, ?, ?)',
        [id, listData.name, listData.color, listData.icon, listData.order]
      );
      set((_state) => ({ lists: [...state.lists, { id, ...listData }] }));
    } catch (e) {
      console.error('addList error', e);
    }
  },

  addTag: async (tagData) => {
    const id = uuidv4();
    try {
      await db.execute(
        'INSERT INTO tags (id, name, color) VALUES (?, ?, ?)',
        [id, tagData.name, tagData.color]
      );
      set((_state) => ({ tags: [...state.tags, { id, ...tagData }] }));
    } catch (e) {
      console.error('addTag error', e);
    }
  }
}));
