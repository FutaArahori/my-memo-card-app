"use client";

import React, { useState, useEffect, useCallback } from 'react';
import NoteCard from '../components/NoteCard';
import { Note, AppData } from '../lib/types';
import { loadAppData, saveAppData } from '../lib/localStorage';

export default function Home() {
  const [appData, setAppData] = useState<AppData>({
    boards: { default: [] },
    activeBoard: 'default',
  });
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [maxZIndex, setMaxZIndex] = useState(0);

  useEffect(() => {
    const loadedData = loadAppData();
    setAppData(loadedData);
    const currentBoardNotes = loadedData.boards[loadedData.activeBoard] || [];
    const currentMaxZIndex = currentBoardNotes.reduce((max, note) => Math.max(max, note.zIndex), 0);
    setMaxZIndex(currentMaxZIndex);
  }, []);

  useEffect(() => {
    if (appData.boards[appData.activeBoard]?.length > 0 || Object.keys(appData.boards).length > 1) {
      setSavingStatus('saving');
      const handler = setTimeout(() => {
        saveAppData(appData);
        setSavingStatus('saved');
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [appData]);

  const updateNote = useCallback((updatedNote: Note) => {
    setAppData((prevData) => {
      const newBoards = { ...prevData.boards };
      const currentNotes = newBoards[prevData.activeBoard] || [];
      newBoards[prevData.activeBoard] = currentNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      return { ...prevData, boards: newBoards };
    });
  }, []);

  const addNote = () => {
    const newZIndex = maxZIndex + 1;
    const newNote: Note = {
      id: Date.now(),
      content: '新しいメモ',
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      color: '#FFFACD',
      zIndex: newZIndex,
      tags: [],
      lastSaved: new Date().toISOString(),
    };

    setAppData((prevData) => {
      const newBoards = { ...prevData.boards };
      const currentNotes = newBoards[prevData.activeBoard] || [];
      newBoards[prevData.activeBoard] = [...currentNotes, newNote];
      return { ...prevData, boards: newBoards };
    });
    setMaxZIndex(newZIndex);
  };

  const deleteNote = useCallback((id: number) => {
    setAppData((prevData) => {
      const newBoards = { ...prevData.boards };
      const currentNotes = newBoards[prevData.activeBoard] || [];
      newBoards[prevData.activeBoard] = currentNotes.filter((note) => note.id !== id);
      return { ...prevData, boards: newBoards };
    });
  }, []);

  const focusNote = useCallback((id: number) => {
    setAppData((prevData) => {
      const newBoards = { ...prevData.boards };
      const currentNotes = newBoards[prevData.activeBoard] || [];
      const focusedNoteIndex = currentNotes.findIndex((note) => note.id === id);

      if (focusedNoteIndex === -1) return prevData;

      const newMaxZIndex = maxZIndex + 1;
      const updatedNotes = currentNotes.map((note, index) =>
        note.id === id ? { ...note, zIndex: newMaxZIndex } : note
      );

      // Sort notes to ensure the focused one is last (highest z-index)
      updatedNotes.sort((a, b) => a.zIndex - b.zIndex);

      newBoards[prevData.activeBoard] = updatedNotes;
      setMaxZIndex(newMaxZIndex);
      return { ...prevData, boards: newBoards };
    });
  }, [maxZIndex]);

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
          {savingStatus === 'idle' && 'アイドル'}
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
