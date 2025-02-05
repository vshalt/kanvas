import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useStore } from './store.ts';
import Section from './components/Section.tsx';
import { Plus, Sun, Moon, Palette, Package } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSectionTitle, setShowNewSectionInput] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showTheme, setShowTheme] = useState(false);
  const { sections, sectionOrder, tasks, moveTask, addSection, theme, setTheme, setSectionOrder } = useStore();

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === 'sectionOrder' && destination.droppableId === 'sectionOrder') {
      const newSectionOrder = Array.from(sectionOrder);
      newSectionOrder.splice(source.index, 1);
      newSectionOrder.splice(destination.index, 0, draggableId);
      setSectionOrder(newSectionOrder);
    } else {
      moveTask(source, destination);
    }
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionTitle.trim()) {
      addSection(newSectionTitle.trim());
      setNewSectionTitle('');
      setShowNewSectionInput(false);
    }
  };

  const filteredTasks = (sectionId: string) => {
    const section = sections[sectionId];
    return (section?.tasks ?? [])
      .map((taskId) => tasks[taskId])
      .filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const allThemes = [
    { name: 'Light Theme', icon: <Sun size={16} />, themeValue: 'light' },
    { name: 'Dark Theme', icon: <Moon size={16} />, themeValue: 'dark' }
  ];

  return (
    <div className={clsx('min-h-screen', theme.colors.background, theme.colors.text)}>
      <header className={clsx('shadow-sm', theme.colors.surface)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center justify-between text-2xl font-bold"><Package size={25} className="mr-2" />Kanvas</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={clsx(
                    'w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    theme.colors.surface,
                    theme.colors.border
                  )}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowTheme(!showTheme)}
                  className={clsx(
                    'p-2 rounded-full transition-colors',
                    theme.colors.hover
                  )}
                  aria-label="Theme"
                >
                  <Palette size={20} />
                </button>
                {showTheme && (
                  <div className={clsx(
                    'absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10',
                    theme.colors.surface,
                    theme.colors.border
                  )}>
                    {allThemes.map(({ name, icon, themeValue }) => (
                      <button
                        key={themeValue}
                        onClick={() => {
                          setTheme(themeValue);
                          setShowTheme(false);
                        }}
                        className={clsx(
                          'flex items-center px-4 py-2 text-sm w-full',
                          theme.colors.hover
                        )}
                      >
                        <span className="px-2">{icon}</span>
                        {name}
                      </button>
                    ))}



                  </div>
                )}
              </div>
              {showNewSectionTitle ? (
                <form onSubmit={handleAddSection} className="flex items-center">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Section title"
                    className={clsx(
                      'px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      theme.colors.surface,
                      theme.colors.border
                    )}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className={clsx(
                      'px-4 py-2 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                      theme.colors.primary
                    )}
                  >
                    Add
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewSectionInput(true)}
                  className={clsx(
                    'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white',
                    theme.colors.primary
                  )}
                >
                  <Plus size={20} className="mr-2" />
                  Add Section
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {sectionOrder.map((sectionId, index) => {
              const section = sections[sectionId];
              const sectionTasks = filteredTasks(sectionId);
              return (
                <Section
                  key={section.id}
                  section={section}
                  tasks={sectionTasks}
                  index={index}
                />
              );
            })}
          </div>



        </DragDropContext>
      </main>
    </div>
  );
}

export default App;
