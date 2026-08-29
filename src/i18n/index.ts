import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "today": "Today",
      "upcoming": "Upcoming",
      "lists": "Lists",
      "stats": "Statistics",
      "settings": "Settings",
      "addTask": "Add Task",
      "noTasksToday": "No tasks for today. Enjoy!",
      "priority": "Priority",
      "dueDate": "Due Date",
      "title": "Task Title",
      "description": "Description",
      "save": "Save",
      "done": "Done",
      "delete": "Delete",
      "undo": "Undo",
      "darkTheme": "Dark Theme",
      "lightTheme": "Light Theme",
      "systemTheme": "System Default",
      "language": "Language",
    }
  },
  uz: {
    translation: {
      "today": "Bugun",
      "upcoming": "Kelgusi",
      "lists": "Ro'yxatlar",
      "stats": "Statistika",
      "settings": "Sozlamalar",
      "addTask": "Vazifa qo'shish",
      "noTasksToday": "Bugun uchun vazifalar yo'q. Hordiq chiqaring!",
      "priority": "Muhimlik",
      "dueDate": "Muddat",
      "title": "Vazifa nomi",
      "description": "Tavsif",
      "save": "Saqlash",
      "done": "Bajarildi",
      "delete": "O'chirish",
      "undo": "Qaytarish",
      "darkTheme": "Qorong'i mavzu",
      "lightTheme": "Yorug' mavzu",
      "systemTheme": "Tizim mavzusi",
      "language": "Til",
    }
  },
  ru: {
    translation: {
      "today": "Сегодня",
      "upcoming": "Предстоящие",
      "lists": "Списки",
      "stats": "Статистика",
      "settings": "Настройки",
      "addTask": "Добавить задачу",
      "noTasksToday": "На сегодня задач нет. Отдыхайте!",
      "priority": "Приоритет",
      "dueDate": "Срок",
      "title": "Название задачи",
      "description": "Описание",
      "save": "Сохранить",
      "done": "Готово",
      "delete": "Удалить",
      "undo": "Отменить",
      "darkTheme": "Темная тема",
      "lightTheme": "Светлая тема",
      "systemTheme": "Системная тема",
      "language": "Язык",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "uz", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
