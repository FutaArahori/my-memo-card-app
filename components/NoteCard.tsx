"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import interact from 'interactjs';
import { Resizable } from 're-resizable';
import { Note } from '../lib/types';

// このコンポーネントは、メモカードの表示と操作を提供
// メモカードのプロパティ
type NoteCardProps = {
  note: Note;
  onUpdate: (updatedNote: Note) => void; 
  onDelete: (id: number) => void;
  onFocus: (id: number) => void;
  savingStatus: 'idle' | 'saving' | 'saved';
};

// NoteCardコンポーネントの定義
const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete, onFocus, savingStatus }) => {
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color);
  const [width, setWidth] = useState(note.width);
  const [height, setHeight] = useState(note.height);
  const [x, setX] = useState(note.x);
  const [y, setY] = useState(note.y);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noteCardRef = useRef<HTMLDivElement>(null);

  // コンポーネントがマウントされたときに、メモの内容と色を初期化
  useEffect(() => {
    setContent(note.content);
    setColor(note.color);
    setWidth(note.width);
    setHeight(note.height);
    setX(note.x);
    setY(note.y);
  }, [note]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleDrag = useCallback((event: Interact.InteractEvent) => {
    const target = event.target;
    const newX = (parseFloat(target.getAttribute('data-x') as string) || 0) + event.dx;
    const newY = (parseFloat(target.getAttribute('data-y') as string) || 0) + event.dy;

    target.style.transform = `translate(${newX}px, ${newY}px)`;
    target.setAttribute('data-x', newX.toString());
    target.setAttribute('data-y', newY.toString());

    setX(newX);
    setY(newY);
  }, []);

  const handleDragEnd = useCallback(() => {
    onUpdate({ ...note, x, y });
  }, [note, onUpdate, x, y]);

  useEffect(() => {
    if (noteCardRef.current) {
      interact(noteCardRef.current)
        .draggable({
          listeners: {
            start (event) {
              onFocus(note.id);
            },
            move: handleDrag,
            end: handleDragEnd,
          },
          modifiers: [
            // interact.modifiers.restrictRect({
            //   restriction: 'parent',
            //   endOnly: true
            // })
          ],
          inertia: true
        });
    }
  }, [note.id, onFocus, handleDrag, handleDragEnd]);

  const handleResize = (e: any, direction: any, ref: HTMLElement, d: any) => {
    setWidth(ref.offsetWidth);
    setHeight(ref.offsetHeight);
    onUpdate({ ...note, width: ref.offsetWidth, height: ref.offsetHeight });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdate({ ...note, content: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColor(e.target.value);
    onUpdate({ ...note, color: e.target.value });
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  const handleFocus = () => {
    onFocus(note.id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const colors = ['#FFFACD', '#ADD8E6', '#90EE90', '#FFB6C1', '#D3D3D3']; // Light colors

  return (
    <div
      ref={noteCardRef}
      data-x={x}
      data-y={y}
      style={{
        position: 'absolute',
        transform: `translate(${x}px, ${y}px)`,
        zIndex: note.zIndex,
        cursor: 'grab',
      }}
    >
      <Resizable
        size={{ width, height }}
        onResizeStop={handleResize}
        minWidth={150}
        minHeight={100}
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: true,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        style={{
          backgroundColor: color,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          boxSizing: 'border-box',
        }}
      >
        <div className="flex justify-between items-center mb-2" onMouseDown={(e) => e.stopPropagation()}>
          <select value={color} onChange={handleColorChange} className="bg-transparent border-none cursor-pointer">
            {colors.map((c) => (
              <option key={c} value={c} style={{ backgroundColor: c }}>
                {c === '#FFFACD' ? 'Yellow' : c === '#ADD8E6' ? 'Blue' : c === '#90EE90' ? 'Green' : c === '#FFB6C1' ? 'Pink' : 'Gray'}
              </option>
            ))}
          </select>
          <button onClick={handleDelete} className="text-gray-600 hover:text-red-500 text-xl font-bold">
            &times;
          </button>
        </div>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            className="flex-grow border-none outline-none resize-none bg-transparent text-base"
            style={{ cursor: 'text' }}
          />
        ) : (
          <div
            className="flex-grow overflow-auto text-base"
            onDoubleClick={handleDoubleClick}
            style={{ cursor: 'text' }}
          >
            {content}
          </div>
        )}
        <div className="text-right text-xs text-gray-500 mt-2">
          {savingStatus === 'saving' && '保存中...'}
          {savingStatus === 'saved' && '保存済み'}
        </div>
      </Resizable>
    </div>
  );
};

export default NoteCard;