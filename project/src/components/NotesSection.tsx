import React, { useState } from 'react';
import { Plus, X, Edit2, Save, StickyNote } from 'lucide-react';
import { Note } from '../types';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string, text: string) => void;
}

export function NotesSection({ notes, onAddNote, onDeleteNote, onEditNote }: NotesSectionProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      onAddNote(newNoteText.trim());
      setNewNoteText('');
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingNoteId) {
      onEditNote(editingNoteId, editText.trim());
      setEditingNoteId(null);
      setEditText('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="text-yellow-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Notes</h2>
        </div>
        <button
          onClick={() => setIsAddingNote(true)}
          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAddingNote && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Écrivez votre note..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                setIsAddingNote(false);
                setNewNoteText('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-sm transition-shadow"
          >
            {editingNoteId === note.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setEditText('');
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="text-gray-700 whitespace-pre-wrap flex-1">{note.text}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {notes.length === 0 && !isAddingNote && (
          <div className="text-center py-8 text-gray-500">
            <StickyNote size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Aucune note pour le moment</p>
            <p className="text-sm">Cliquez sur le + pour ajouter votre première note</p>
          </div>
        )}
      </div>
    </div>
  );
}