import { AppData } from './types';

// このファイルは、アプリケーションのデータをローカルストレージに保存および読み込むためのユーティリティ関数を提供
const LOCAL_STORAGE_KEY = 'react-note-app-data';

// データをローカルストレージから読み込む関数
export const loadAppData = (): AppData => {
  try {
    const serializedData = localStorage.getItem(LOCAL_STORAGE_KEY); // ローカルストレージからデータを取得
    // データが存在しない場合はデフォルトのデータを返す
    if (serializedData === null) {
      return {
        boards: {
          default: [],
        },
        activeBoard: 'default',
      };
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error loading data from localStorage", error);
    return {
      boards: {
        default: [],
      },
      activeBoard: 'default',
    };
  }
};

// データをローカルストレージに保存する関数
export const saveAppData = (data: AppData) => {
  try {
    // データをJSON形式にシリアライズしてローカルストレージに保存
    const serializedData = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Error saving data to localStorage", error);
  }
};