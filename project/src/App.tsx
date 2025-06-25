import React, { useState, useMemo } from 'react';
import { CheckSquare } from 'lucide-react';
import { Task, Note, FilterType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TaskItem } from './components/TaskItem';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilter } from './components/TaskFilter';
import { NotesSection } from './components/NotesSection';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('todo-notes', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showNotes, setShowNotes] = useState(false);

  // Task operations
  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id: string, text: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, text, updatedAt: new Date() }
        : task
    ));
  };

  // Note operations
  const addNote = (text: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const editNote = (id: string, text: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, text, updatedAt: new Date() }
        : note
    ));
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Task counts
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  }), [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckSquare className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Ma Liste de Tâches</h1>
          </div>
          <p className="text-gray-600">Organisez vos tâches et notes en toute simplicité</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setShowNotes(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !showNotes
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Tâches ({taskCounts.all})
            </button>
            <button
              onClick={() => setShowNotes(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                showNotes
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Notes ({notes.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {showNotes ? (
            <NotesSection
              notes={notes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
              onEditNote={editNote}
            />
          ) : (
            <>
              <AddTaskForm onAdd={addTask} />
              
              <TaskFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                taskCounts={taskCounts}
              />

              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                ))}

                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">
                      {filter === 'all' && 'Aucune tâche'}
                      {filter === 'active' && 'Aucune tâche active'}
                      {filter === 'completed' && 'Aucune tâche terminée'}
                    </h3>
                    <p className="text-sm">
                      {filter === 'all' && 'Commencez par ajouter votre première tâche'}
                      {filter === 'active' && 'Toutes vos tâches sont terminées !'}
                      {filter === 'completed' && 'Vous n\'avez pas encore terminé de tâches'}
                    </p>
                  </div>
                )}
              </div>

              {taskCounts.active > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500">
                  {taskCounts.active} tâche{taskCounts.active > 1 ? 's' : ''} restante{taskCounts.active > 1 ? 's' : ''}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;