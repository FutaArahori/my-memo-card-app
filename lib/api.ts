import { Note } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

export const getNotes = async (boardName: string): Promise<Note[]> => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardName}/notes`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
};

export const createNote = async (boardName: string, note: Omit<Note, 'id' | 'lastSaved'>): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardName}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...note, lastSaved: new Date().toISOString() }),
  });
  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return response.json();
};

export const updateNote = async (id: number, note: Partial<Note>): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...note, lastSaved: new Date().toISOString() }),
  });
  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return response.json();
};

export const deleteNote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
};