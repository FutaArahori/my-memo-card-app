-- ボード情報を管理するテーブル
CREATE TABLE boards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- メモ情報を管理するテーブル
CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    content TEXT,
    x INT NOT NULL,
    y INT NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    z_index INT NOT NULL,
    tags JSON,
    last_saved DATETIME NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- 初期データとしてデフォルトのボードを挿入
INSERT INTO boards (name) VALUES ('default');