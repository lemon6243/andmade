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

-- 기본 관리자 계정 (로그인 후 반드시 비밀번호를 변경해주세요)
INSERT OR IGNORE INTO admins (username, password_hash) VALUES 
  ('admin', 'andmade2024');

-- 샘플 게시글
INSERT OR IGNORE INTO posts (title, content, category) VALUES 
  ('앤드메이드 오픈 안내', '안녕하세요! 서울 장안동 키즈공방 앤드메이드입니다. 아이들과 함께 즐거운 만들기 시간을 가져보세요!', 'notice'),
  ('봄 시즌 특별 클래스 오픈', '2024년 봄을 맞아 새로운 클레이 공예 클래스를 오픈합니다. 많은 참여 부탁드립니다!', 'notice');

-- 실제 @andmade 채널 유튜브 영상
INSERT OR IGNORE INTO youtube_videos (title, video_id, description, class_type, thumbnail_url) VALUES
  ('미니어처 떡국 한 상 차림', '3mJO0Di9usI', '앤드메이드 미니어처 떡국 한 상 만들기', 'miniature', ''),
  ('사장님~ 여기 솜사탕 하나 주세요!', 'LojCAHwizmE', '앤드메이드 미니어처 솜사탕 만들기', 'miniature', ''),
  ('누구나 쉽게 하는 백드롭페인팅', '7_i6OrP186M', '앤드메이드 클레이 백드롭페인팅 클래스', 'clay', ''),
  ('멍때리고 보게 되는 클레이 장미 만들기', 'rUe_7JlkESc', '앤드메이드 클레이 장미 만들기', 'clay', '');
