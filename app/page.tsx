"use client";

import React, { useState, useEffect, useCallback } from 'react';
import NoteCard from '../components/NoteCard';
import { Note, AppData } from '../lib/types';
import { getNotes, createNote, updateNote as apiUpdateNote, deleteNote as apiDeleteNote } from '../lib/api';

export default function Home() {
  const [appData, setAppData] = useState<AppData>({
    boards: { default: [] },
    activeBoard: 'default',
  });
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [maxZIndex, setMaxZIndex] = useState(0);

  const fetchNotes = useCallback(async (boardName: string) => {
    try {
      setSavingStatus('saving');
      const notes = await getNotes(boardName);
      setAppData((prev) => ({
        ...prev,
        boards: { ...prev.boards, [boardName]: notes },
      }));
      const currentMaxZIndex = notes.reduce((max, note) => Math.max(max, note.zIndex), 0);
      setMaxZIndex(currentMaxZIndex);
      setSavingStatus('saved');
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setSavingStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchNotes(appData.activeBoard);
  }, [appData.activeBoard, fetchNotes]);

  const updateNote = useCallback(async (updatedNote: Note) => {
    try {
      setSavingStatus('saving');
      const savedNote = await apiUpdateNote(updatedNote.id, updatedNote);
      setAppData((prevData) => {
        const newBoards = { ...prevData.boards };
        const currentNotes = newBoards[prevData.activeBoard] || [];
        newBoards[prevData.activeBoard] = currentNotes.map((note) =>
          note.id === savedNote.id ? savedNote : note
        );
        return { ...prevData, boards: newBoards };
      });
      setSavingStatus('saved');
    } catch (error) {
      console.error("Failed to update note:", error);
      setSavingStatus('error');
    }
  }, [appData.activeBoard]);

  const addNote = async () => {
    const newZIndex = maxZIndex + 1;
    const newNoteData = {
      content: '新しいメモ',
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      color: '#FFFACD',
      zIndex: newZIndex,
      tags: [],
    };

    try {
      setSavingStatus('saving');
      const savedNote = await createNote(appData.activeBoard, newNoteData);
      setAppData((prevData) => {
        const newBoards = { ...prevData.boards };
        const currentNotes = newBoards[prevData.activeBoard] || [];
        newBoards[prevData.activeBoard] = [...currentNotes, savedNote];
        return { ...prevData, boards: newBoards };
      });
      setMaxZIndex(newZIndex);
      setSavingStatus('saved');
    } catch (error) {
      console.error("Failed to create note:", error);
      setSavingStatus('error');
    }
  };

  const deleteNote = useCallback(async (id: number) => {
    try {
      setSavingStatus('saving');
      await apiDeleteNote(id);
      setAppData((prevData) => {
        const newBoards = { ...prevData.boards };
        const currentNotes = newBoards[prevData.activeBoard] || [];
        newBoards[prevData.activeBoard] = currentNotes.filter((note) => note.id !== id);
        return { ...prevData, boards: newBoards };
      });
      setSavingStatus('saved');
    } catch (error) {
      console.error("Failed to delete note:", error);
      setSavingStatus('error');
    }
  }, [appData.activeBoard]);

  const focusNote = useCallback((id: number) => {
    setAppData((prevData) => {
      const newBoards = { ...prevData.boards };
      const currentNotes = newBoards[prevData.activeBoard] || [];
      const focusedNoteIndex = currentNotes.findIndex((note) => note.id === id);

      if (focusedNoteIndex === -1) return prevData;

      const newMaxZIndex = maxZIndex + 1;
      const noteToUpdate = currentNotes.find((note) => note.id === id);

      if (!noteToUpdate) return prevData;

      const updatedNote = { ...noteToUpdate, zIndex: newMaxZIndex };

      apiUpdateNote(id, { zIndex: newMaxZIndex }).catch(err => console.error("Failed to save z-index change", err));

      const updatedNotes = currentNotes.map(note => note.id === id ? updatedNote : note);

      newBoards[prevData.activeBoard] = updatedNotes;
      setMaxZIndex(newMaxZIndex);
      return { ...prevData, boards: newBoards };
    });
  }, [maxZIndex, appData.activeBoard]);

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBoard = e.target.value;
    setAppData((prevData) => {
      const currentBoardNotes = prevData.boards[newBoard] || [];
      const currentMaxZIndex = currentBoardNotes.reduce((max, note) => Math.max(max, note.zIndex), 0);
      setMaxZIndex(currentMaxZIndex);
      return { ...prevData, activeBoard: newBoard };
    });
  };

  const addBoard = () => {
    const boardName = prompt('新しいボード名を入力してください:');
    if (boardName && !appData.boards[boardName]) {
      setAppData((prevData) => ({
        ...prevData,
        boards: {
          ...prevData.boards,
          [boardName]: [],
        },
        activeBoard: boardName,
      }));
    } else if (boardName) {
      alert('そのボード名はすでに存在します。');
    }
  };

  const deleteBoard = () => {
    if (Object.keys(appData.boards).length === 1) {
      alert('最後のボードは削除できません。');
      return;
    }
    const confirmDelete = confirm(`ボード "${appData.activeBoard}" を削除してもよろしいですか？`);
    if (confirmDelete) {
      setAppData((prevData) => {
        const newBoards = { ...prevData.boards };
        delete newBoards[prevData.activeBoard];
        const newActiveBoard = Object.keys(newBoards)[0];
        const currentBoardNotes = newBoards[newActiveBoard] || [];
        const currentMaxZIndex = currentBoardNotes.reduce((max, note) => Math.max(max, note.zIndex), 0);
        setMaxZIndex(currentMaxZIndex);
        return { ...prevData, boards: newBoards, activeBoard: newActiveBoard };
      });
    }
  };

  const currentNotes = appData.boards[appData.activeBoard] || [];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      <header className="absolute top-0 left-0 right-0 bg-white p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <select
            value={appData.activeBoard}
            onChange={handleBoardChange}
            className="p-2 border rounded-md"
          >
            {Object.keys(appData.boards).map((boardName) => (
              <option key={boardName} value={boardName}>
                {boardName}
              </option>
            ))}
          </select>
          <button onClick={addBoard} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            ボード追加
          </button>
          {Object.keys(appData.boards).length > 1 && (
            <button onClick={deleteBoard} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              ボード削除
            </button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {savingStatus === 'saving' && '保存中...'}
          {savingStatus === 'saved' && '保存済み'}
          {savingStatus === 'error' && 'エラー'}
          {savingStatus === 'idle' && ''}
        </div>
      </header>

      <main className="relative w-full h-full pt-16"> {/* Adjust padding-top for header */}
        {currentNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onFocus={focusNote}
            savingStatus={savingStatus}
          />
        ))}
      </main>

      <button
        onClick={addNote}
        className="absolute bottom-8 right-8 bg-green-500 text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 z-20"
      >
        ＋
      </button>
    </div>
  );
}
