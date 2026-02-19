-- Migration 0002: class_settings 테이블 추가
CREATE TABLE IF NOT EXISTS class_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id TEXT NOT NULL UNIQUE,
  price TEXT NOT NULL DEFAULT '35000',
  duration TEXT DEFAULT '60~90분',
  age TEXT DEFAULT '전 연령',
  max_participants TEXT DEFAULT '8',
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
