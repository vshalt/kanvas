import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as types from './types.ts';

const themes: Record<string, types.Theme> = {
  light: {
    name: 'light',
    colors: {
      background: 'bg-gray-50',
      surface: 'bg-white',
      primary: 'bg-blue-600',
      secondary: 'bg-gray-100',
      text: 'text-gray-900',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      primary: 'bg-blue-500',
      secondary: 'bg-gray-700',
      text: 'text-white',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700',
    },
  },
};

const initialState: types.Kanvas = {
  tasks: {},
  sections: {
    'section-1': {
      id: 'section-1',
      title: 'To Do',
      tasks: [],
    },
    'section-2': {
      id: 'section-2',
      title: 'In Progress',
      tasks: [],
    },
    'section-3': {
      id: 'section-3',
      title: 'Done',
      tasks: [],
    },
  },
  sectionOrder: ['section-1', 'section-2', 'section-3'],
  theme: themes.light,
};

export const useStore = create(
  persist<types.Kanvas & {
    addTask: (section: string, task: Omit<types.Task, 'id' | 'createdAt'>) => void;
    moveTask: (source: any, destination: any) => void;
    updateTask: (taskId: string, updates: Partial<types.Task>) => void;
    deleteTask: (taskId: string) => void;
    addSection: (title: string) => void;
    deleteSection: (section: string) => void;
    updateSection: (sectionId: string, newTitle: string) => void;
    setSectionOrder: (order: string[]) => void;
    setTheme: (themeName: string) => void;
  }>(
    (set) => ({
      ...initialState,

      setTheme: (themeName) => {
        set((state) => ({
          ...state,
          theme: themes[themeName] || themes.light,
        }));
      },

      addTask: (section, task) => {
        const taskId = `task-${Date.now()}`;
        set((state) => {
          const newState = {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...task,
                id: taskId,
                createdAt: new Date().toISOString(),
              },
            },
            sections: {
              ...state.sections,
              [section]: {
                ...state.sections[section],
                tasks: [...state.sections[section].tasks, taskId],
              },
            },
          };
          return {
            ...newState,
          };
        });
      },

      moveTask: (source, destination) => {
        set((state) => {
          const { sections } = state;
          const start = sections[source.droppableId];
          const finish = sections[destination.droppableId];

          if (start === finish) {
            const newTaskIds = Array.from(start.tasks);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, start.tasks[source.index]);

            const newSection = {
              ...start,
              tasks: newTaskIds,
            };

            return {
              ...state,
              sections: {
                ...state.sections,
                [newSection.id]: newSection,
              },
            };
          }

          const startTaskIds = Array.from(start.tasks);
          startTaskIds.splice(source.index, 1);
          const newStart = {
            ...start,
            tasks: startTaskIds,
          };

          const finishTaskIds = Array.from(finish.tasks);
          finishTaskIds.splice(
            destination.index,
            0,
            start.tasks[source.index]
          );
          const newFinish = {
            ...finish,
            tasks: finishTaskIds,
          };

          return {
            ...state,
            sections: {
              ...state.sections,
              [newStart.id]: newStart,
              [newFinish.id]: newFinish,
            },
          };
        });
      },
      updateTask: (taskId, updates) => {
        set((state) => ({
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...updates },
          },
        }));
      },
      deleteTask: (taskId) => {
        set((state) => {
          const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;
          const allSections = state.sections;
          for (const sectionId in allSections) {
            allSections[sectionId].tasks = allSections[sectionId].tasks.filter(
              (taskIdInSection) => taskIdInSection !== taskId
            );
          }
          return {
            ...state,
            sections: allSections,
            tasks: remainingTasks,
          };
        });
      },

      addSection: (title) => {
        const sectionId = `section-${Date.now()}`;
        set((state) => ({
          ...state,
          sections: {
            ...state.sections,
            [sectionId]: {
              id: sectionId,
              title,
              tasks: [],
            },
          },
          sectionOrder: [...state.sectionOrder, sectionId],
        }));
      },
      updateSection(sectionId: string, newTitle: string) {
        set((state) => {
          return {
            ...state,
            sections: {
              ...state.sections,
              [sectionId]: {
                ...state.sections[sectionId],
                title: newTitle
              }
            }
          };
        });
      },

      deleteSection: (sectionId) => {
        set((state) => {
          const { [sectionId]: deletedSection, ...remainingSections } =
            state.sections;
          return {
            ...state,
            sections: remainingSections,
            sectionOrder: state.sectionOrder.filter((id) => id !== sectionId),
          };
        });
      },
      setSectionOrder(order: string[]) {
        set((state) => {
          return {
            ...state,
            sectionOrder: order,
          };
        });
      },
    }),
    {
      name: 'kanvas',
    }
  )
);
