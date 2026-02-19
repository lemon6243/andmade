// 데이터베이스 유틸리티 함수

export interface Env {
  DB: D1Database
}

// ===== 예약 관련 =====
export async function getReservations(db: D1Database, status?: string) {
  let query = 'SELECT * FROM reservations'
  const params: any[] = []
  
  if (status) {
    query += ' WHERE status = ?'
    params.push(status)
  }
  query += ' ORDER BY created_at DESC'
  
  const result = await db.prepare(query).bind(...params).all()
  return result.results
}

export async function createReservation(db: D1Database, data: {
  name: string
  phone: string
  email?: string
  class_type: string
  class_date: string
  class_time: string
  participants: number
  message?: string
}) {
  const result = await db.prepare(`
    INSERT INTO reservations (name, phone, email, class_type, class_date, class_time, participants, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).bind(
    data.name, data.phone, data.email || null,
    data.class_type, data.class_date, data.class_time,
    data.participants, data.message || null
  ).run()
  
  return result
}

export async function updateReservationStatus(db: D1Database, id: number, status: string) {
  const result = await db.prepare(
    'UPDATE reservations SET status = ? WHERE id = ?'
  ).bind(status, id).run()
  return result
}

export async function deleteReservation(db: D1Database, id: number) {
  return await db.prepare('DELETE FROM reservations WHERE id = ?').bind(id).run()
}

// ===== 게시글 관련 =====
export async function getPosts(db: D1Database, category?: string, published?: boolean) {
  let query = 'SELECT * FROM posts WHERE 1=1'
  const params: any[] = []
  
  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }
  if (published !== undefined) {
    query += ' AND published = ?'
    params.push(published ? 1 : 0)
  }
  query += ' ORDER BY created_at DESC'
  
  const result = await db.prepare(query).bind(...params).all()
  return result.results
}

export async function getPost(db: D1Database, id: number) {
  const result = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first()
  return result
}

export async function createPost(db: D1Database, data: {
  title: string
  content: string
  category?: string
  published?: number
}) {
  const result = await db.prepare(`
    INSERT INTO posts (title, content, category, published)
    VALUES (?, ?, ?, ?)
  `).bind(
    data.title, data.content,
    data.category || 'notice',
    data.published !== undefined ? data.published : 1
  ).run()
  return result
}

export async function updatePost(db: D1Database, id: number, data: {
  title?: string
  content?: string
  category?: string
  published?: number
}) {
  const fields: string[] = []
  const values: any[] = []
  
  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title) }
  if (data.content !== undefined) { fields.push('content = ?'); values.push(data.content) }
  if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category) }
  if (data.published !== undefined) { fields.push('published = ?'); values.push(data.published) }
  
  if (fields.length === 0) return null
  
  fields.push('updated_at = CURRENT_TIMESTAMP')
  values.push(id)
  
  const result = await db.prepare(
    `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run()
  
  return result
}

export async function deletePost(db: D1Database, id: number) {
  return await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
}

// ===== 갤러리 관련 =====
export async function getGallery(db: D1Database, category?: string) {
  let query = 'SELECT * FROM gallery WHERE 1=1'
  const params: any[] = []
  
  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }
  query += ' ORDER BY created_at DESC'
  
  const result = await db.prepare(query).bind(...params).all()
  return result.results
}

export async function addGalleryItem(db: D1Database, data: {
  title: string
  description?: string
  image_url: string
  category?: string
}) {
  const result = await db.prepare(`
    INSERT INTO gallery (title, description, image_url, category)
    VALUES (?, ?, ?, ?)
  `).bind(
    data.title, data.description || null,
    data.image_url, data.category || 'general'
  ).run()
  return result
}

export async function deleteGalleryItem(db: D1Database, id: number) {
  return await db.prepare('DELETE FROM gallery WHERE id = ?').bind(id).run()
}

// ===== 유튜브 영상 관련 =====
export async function getVideos(db: D1Database, class_type?: string) {
  let query = 'SELECT * FROM youtube_videos WHERE 1=1'
  const params: any[] = []
  
  if (class_type) {
    query += ' AND class_type = ?'
    params.push(class_type)
  }
  query += ' ORDER BY created_at DESC'
  
  const result = await db.prepare(query).bind(...params).all()
  return result.results
}

export async function addVideo(db: D1Database, data: {
  title: string
  video_id: string
  description?: string
  class_type?: string
  thumbnail_url?: string
  published_at?: string
}) {
  const result = await db.prepare(`
    INSERT OR IGNORE INTO youtube_videos (title, video_id, description, class_type, thumbnail_url, published_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    data.title, data.video_id,
    data.description || null, data.class_type || null,
    data.thumbnail_url || `https://img.youtube.com/vi/${data.video_id}/maxresdefault.jpg`,
    data.published_at || new Date().toISOString()
  ).run()
  return result
}

export async function deleteVideo(db: D1Database, id: number) {
  return await db.prepare('DELETE FROM youtube_videos WHERE id = ?').bind(id).run()
}

// ===== DB 초기화 (테이블이 없을 경우) =====
export async function initDB(db: D1Database) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS reservations (
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
    )`,
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'notice',
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS youtube_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      video_id TEXT NOT NULL UNIQUE,
      description TEXT,
      class_type TEXT,
      thumbnail_url TEXT,
      published_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ]

  // D1 batch() 사용하여 개별 실행
  await db.batch(statements.map(sql => db.prepare(sql)))
}
