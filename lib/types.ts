// このファイルは、アプリケーションで使用される型定義を提供
export type Note = {
  id: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zIndex: number;
  tags: string[];
  lastSaved: string;
};

export type Board = {
  [boardName: string]: Note[];
};

export type AppData = {
  boards: Board;
  activeBoard: string;
};