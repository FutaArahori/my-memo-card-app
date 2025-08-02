# React Note App

これは、React (Next.js) と Spring Boot で構築された、付箋のようなUIでメモを管理するノートアプリケーションです。

![アプリケーションのスクリーンショット](httpsd://user-images.githubusercontent.com/1234567/123456789-abcdef.png)  <!-- あとで実際のスクリーンショットに差し替える -->

## ✨ 主な機能

*   **ボード管理**: 複数のノートを「ボード」という単位でグループ化できます。
*   **ノート操作**:
    *   ノートの追加、編集、削除
    *   ドラッグ＆ドロップによる自由な配置
    *   リサイズによる大きさの変更
    *   背景色の変更
*   **データ永続化**: 作成したノートやボードの情報はデータベースに保存され、いつでも復元できます。

## 🛠️ 技術スタック

このアプリケーションは、以下の技術を使用して構築されています。

*   **フロントエンド**:
    *   [Next.js](https://nextjs.org/)
    *   [React](https://react.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Interact.js](https://interactjs.io/) (ドラッグ＆ドロップ)
    *   [Re-resizable](https://github.com/bokuweb/re-resizable) (リサイズ)
*   **バックエンド**:
    *   [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
    *   [Spring Boot](https://spring.io/projects/spring-boot)
    *   [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
*   **データベース**:
    *   [MySQL 8.0](https://www.mysql.com/)
*   **環境構築**:
    *   [Docker](https://www.docker.com/)
    *   [Maven](https://maven.apache.org/)

## 🚀 開発環境のセットアップ

以下の手順で、ローカル環境でアプリケーションを起動できます。

### 1. 前提条件

*   [Docker](https://www.docker.com/get-started) がインストールされていること。
*   [Node.js](https://nodejs.org/) (v18以上推奨) がインストールされていること。
*   [Java (JDK 17)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) がインストールされていること。
*   [Maven](https://maven.apache.org/download.cgi) がインストールされていること。

### 2. データベースの起動

まず、Dockerを使ってMySQLデータベースを起動します。プロジェクトのルートディレクトリで以下のコマンドを実行してください。

```bash
docker-compose up -d
```

これにより、`docker-compose.yml` の設定に基づいてMySQLコンテナがバックグラウンドで起動し、`db/init.sql` によってテーブルが自動的に作成されます。

### 3. バックエンドサーバーの起動

次に、バックエンドのSpring Bootアプリケーションを起動します。
新しいターミナルを開き、`backend` ディレクトリに移動してMavenコマンドを実行します。

```bash
cd backend
mvn spring-boot:run
```

サーバーは `http://localhost:8080` で起動します。

### 4. フロントエンドサーバーの起動

最後に、フロントエンドのNext.jsアプリケーションを起動します。
別の新しいターミナルを開き、プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
npm install
npm run dev
```

### 5. アプリケーションへのアクセス

すべてのサーバーが起動したら、ブラウザで以下のURLにアクセスしてください。

[http://localhost:3000](http://localhost:3000)

ノートアプリが表示され、操作できるはずです。

## 📄 APIエンドポイント

バックエンドは以下のAPIを提供します。ベースURLは `http://localhost:8080/api` です。

| メソッド | URL                               | 説明                             |
| :------- | :-------------------------------- | :------------------------------- |
| `GET`    | `/boards/{boardName}/notes`       | 指定したボードの全ノートを取得   |
| `POST`   | `/boards/{boardName}/notes`       | 指定したボードに新しいノートを作成 |
| `PUT`    | `/notes/{id}`                     | 指定したIDのノートを更新         |
| `DELETE` | `/notes/{id}`                     | 指定したIDのノートを削除         |
