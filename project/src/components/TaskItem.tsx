import React, { useState } from 'react';
import { Check, X, Edit2, Save } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`group bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {task.completed && <Check size={12} className="m-auto" />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-700 transition-colors"
            >
              <Save size={16} />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between">
            <span
              className={`flex-1 text-gray-800 transition-all duration-200 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.text}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}