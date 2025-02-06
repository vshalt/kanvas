import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MoreVertical, Plus, Trash2, Edit2 } from 'lucide-react';
import Task from './Task.tsx';
import * as types from '../types.tsx';
import { useStore } from '../store.ts';
import clsx from 'clsx';

type SectionProps = {
  section: types.Section;
  tasks: types.Task[];
  index: number;
}

const Section = ({ section, tasks, index }: SectionProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(section.title);
  const { addTask, deleteSection, theme, updateSection } = useStore();

  const handleAddTask = () => {
    addTask(section.id, {
      title: 'New Task',
      description: 'Add description here',
      labels: ['new'],
    });
  };

  const handleDeleteSection = () => {
    deleteSection(section.id);
    setShowOptions(false);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      updateSection(section.id, newTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className={clsx('p-4 rounded-lg w-80 flex-shrink-0', theme.colors.secondary)}>
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 mr-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={clsx(
                'w-full px-2 py-1 text-lg font-semibold border rounded',
                theme.colors.surface,
                theme.colors.border
              )}
              autoFocus
              onBlur={() => {
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTitleSubmit(e);
                }
              }}
            />
          </form>
        ) : (
          <h2
            className="text-lg font-semibold cursor-pointer hover:text-opacity-80"
            onClick={() => setIsEditing(true)}
          >
            {section.title}
          </h2>
        )}
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={handleAddTask}
            className={clsx('p-1 rounded-full transition-colors', theme.colors.hover)}
            aria-label="Add task"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={clsx('p-1 rounded-full transition-colors', theme.colors.hover)}
            aria-label="Section options"
          >
            <MoreVertical size={20} />
          </button>
          {showOptions && (
            <div className={clsx(
              'absolute right-0 top-8 rounded-lg shadow-lg py-2 w-48 z-10',
              theme.colors.surface
            )}>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowOptions(false)
                }}
                className={clsx(
                  'w-full px-4 py-2 text-left flex items-center',
                  theme.colors.hover
                )}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Title
              </button>
              <button
                onClick={handleDeleteSection}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Section
              </button>
            </div>
          )}
        </div>
      </div>
      <Droppable droppableId={section.id} key={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              'min-h-[700px] max-h-screen transition-colors',
              snapshot.isDraggingOver ? theme.colors.hover : ''
            )}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Section;
