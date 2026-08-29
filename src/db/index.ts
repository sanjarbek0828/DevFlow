import { open } from '@op-engineering/op-sqlite';

export const db = open({
  name: 'todo.sqlite',
});

export const initDB = async () => {
  try {
    // Create lists table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS lists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        list_order INTEGER NOT NULL
      );
    `);

    // Create tags table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);

    // Create tasks table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        listId TEXT NOT NULL,
        tagIds TEXT, -- JSON array string
        priority TEXT NOT NULL,
        dueDate TEXT, -- ISO string
        reminderAt TEXT, -- ISO string
        isCompleted INTEGER NOT NULL DEFAULT 0,
        completedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        subtasks TEXT, -- JSON array string
        repeatRule TEXT,
        FOREIGN KEY (listId) REFERENCES lists(id) ON DELETE CASCADE
      );
    `);

    // Create indexes for efficient querying
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_tasks_listId ON tasks(listId);`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_tasks_isCompleted ON tasks(isCompleted);`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database', error);
  }
};
