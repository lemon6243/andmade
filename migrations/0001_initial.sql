-- 예약 테이블
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  class_type TEXT NOT NULL,
  class_date TEXT NOT NULL,
  class_time TEXT NOT NULL,
  participants INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 공지사항/게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'notice',
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 갤러리(작품 사진) 테이블
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 유튜브 영상 수동 등록 테이블
CREATE TABLE IF NOT EXISTS youtube_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  video_id TEXT NOT NULL UNIQUE,
  description TEXT,
  class_type TEXT,
  thumbnail_url TEXT,
  published_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 관리자 계정 (비밀번호: andmade2024)
INSERT OR IGNORE INTO admins (username, password_hash) VALUES 
  ('admin', '$2a$10$andmade2024hashedpassword');

-- 샘플 게시글
INSERT OR IGNORE INTO posts (title, content, category) VALUES 
  ('앤드메이드 오픈 안내', '안녕하세요! 서울 장안동 키즈공방 앤드메이드입니다. 아이들과 함께 즐거운 만들기 시간을 가져보세요!', 'notice'),
  ('봄 시즌 특별 클래스 오픈', '2024년 봄을 맞아 새로운 클레이 공예 클래스를 오픈합니다. 많은 참여 부탁드립니다!', 'notice');

-- 샘플 유튜브 영상
INSERT OR IGNORE INTO youtube_videos (title, video_id, description, class_type, thumbnail_url) VALUES
  ('클레이 케이크 만들기', 'dQw4w9WgXcQ', '귀여운 미니어처 클레이 케이크 만들기 영상', 'clay', ''),
  ('데코덴 폰케이스 만들기', 'dQw4w9WgXcQ', '달콤한 디저트 장식 폰케이스 DIY', 'decoden', ''),
  ('미니어처 음식 만들기', 'dQw4w9WgXcQ', '손바닥 크기 미니어처 음식 클레이 작품', 'miniature', '');
