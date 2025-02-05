import { useState } from "react";
import { Draggable } from '@hello-pangea/dnd';
import { Clock, Pencil, Trash } from 'lucide-react';
import clsx from "clsx";
import * as types from '../types.ts';
import { useStore } from "../store.ts";

type TaskProps = {
  task: types.Task;
  index: number;
}

const Task = ({ task, index }: TaskProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const { updateTask, deleteTask, theme } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={clsx('p-4 rounded-lg shadow-sm mb-3', theme.colors.surface)}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={clsx(
              'w-full mb-2 px-2 py-1 border rounded',
              theme.colors.surface,
              theme.colors.border
            )}
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={clsx(
              'w-full mb-3 px-2 py-1 border rounded',
              theme.colors.surface,
              theme.colors.border
            )}
            placeholder="Task description"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={clsx(
                'px-3 py-1 text-sm text-white rounded',
                theme.colors.primary
              )}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx(
            'p-4 rounded-lg shadow-sm mb-3 transition-shadow group',
            theme.colors.surface,
            snapshot.isDragging ? 'shadow-lg' : ''
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className={clsx('p-1 rounded', theme.colors.hover)}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  deleteTask(task.id)
                }}
                className="p-1 hover:bg-gray-100 rounded text-red-600"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
          <p className="text-sm mb-3 opacity-75">{task.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    theme.name === 'dark'
                      ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                      : 'bg-blue-100 text-blue-800'
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center text-sm opacity-75">
              <Clock size={14} className="mr-1" />
              {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
export default Task;
