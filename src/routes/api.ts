import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import type { Env } from '../lib/db'
import {
  createReservation, getReservations, updateReservationStatus, deleteReservation,
  getPosts, createPost, updatePost, deletePost,
  getGallery, addGalleryItem, deleteGalleryItem,
  getVideos, addVideo, deleteVideo,
  initDB
} from '../lib/db'

const api = new Hono<{ Bindings: Env }>()

api.use('/*', cors())

// ===== 관리자 인증 체크 =====
const SESSION_TOKEN = 'andmade_admin_session'
const SESSION_VALUE = 'authenticated_v1'

function isAdmin(c: any): boolean {
  const token = getCookie(c, SESSION_TOKEN)
  return token === SESSION_VALUE
}

// ===== 예약 API =====
// POST /api/reservations - 예약 생성
api.post('/reservations', async (c) => {
  try {
    await initDB(c.env.DB)
    const body = await c.req.json()
    
    const { name, phone, email, class_type, class_date, class_time, participants, message } = body

    // 유효성 검사
    if (!name || !phone || !class_type || !class_date || !class_time) {
      return c.json({ success: false, message: '필수 항목을 모두 입력해주세요.' }, 400)
    }

    if (!participants || participants < 1 || participants > 20) {
      return c.json({ success: false, message: '참여 인원을 올바르게 입력해주세요.' }, 400)
    }

    const result = await createReservation(c.env.DB, {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      class_type: String(class_type),
      class_date: String(class_date),
      class_time: String(class_time),
      participants: Number(participants),
      message: message ? String(message).trim() : undefined
    })

    return c.json({ 
      success: true, 
      message: '예약이 접수되었습니다.',
      id: result.meta?.last_row_id
    })
  } catch (error) {
    console.error('Reservation error:', error)
    return c.json({ success: false, message: '예약 처리 중 오류가 발생했습니다.' }, 500)
  }
})

// ===== 관리자 예약 API =====
// PUT /api/admin/reservations/:id/status
api.put('/admin/reservations/:id/status', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const id = Number(c.req.param('id'))
    const { status } = await c.req.json()

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return c.json({ success: false, message: '올바른 상태값이 아닙니다.' }, 400)
    }

    await updateReservationStatus(c.env.DB, id, status)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// DELETE /api/admin/reservations/:id
api.delete('/admin/reservations/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const id = Number(c.req.param('id'))
    await deleteReservation(c.env.DB, id)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// ===== 관리자 게시글 API =====
// POST /api/admin/posts
api.post('/admin/posts', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const body = await c.req.json()
    const { title, content, category, published } = body

    if (!title || !content) {
      return c.json({ success: false, message: '제목과 내용을 입력해주세요.' }, 400)
    }

    const result = await createPost(c.env.DB, {
      title: String(title),
      content: String(content),
      category: category || 'notice',
      published: published !== undefined ? Number(published) : 1
    })

    return c.json({ success: true, id: result.meta?.last_row_id })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// PUT /api/admin/posts/:id
api.put('/admin/posts/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const id = Number(c.req.param('id'))
    const body = await c.req.json()
    await updatePost(c.env.DB, id, body)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// DELETE /api/admin/posts/:id
api.delete('/admin/posts/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const id = Number(c.req.param('id'))
    await deletePost(c.env.DB, id)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// ===== 관리자 갤러리 API =====
// POST /api/admin/gallery
api.post('/admin/gallery', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const body = await c.req.json()
    const { title, image_url, description, category } = body

    if (!title || !image_url) {
      return c.json({ success: false, message: '제목과 이미지 URL을 입력해주세요.' }, 400)
    }

    const result = await addGalleryItem(c.env.DB, {
      title: String(title),
      image_url: String(image_url),
      description: description ? String(description) : undefined,
      category: category || 'general'
    })

    return c.json({ success: true, id: result.meta?.last_row_id })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// DELETE /api/admin/gallery/:id
api.delete('/admin/gallery/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const id = Number(c.req.param('id'))
    await deleteGalleryItem(c.env.DB, id)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// ===== 관리자 영상 API =====
// POST /api/admin/videos
api.post('/admin/videos', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const body = await c.req.json()
    const { title, video_id, description, class_type } = body

    if (!title || !video_id) {
      return c.json({ success: false, message: '제목과 Video ID를 입력해주세요.' }, 400)
    }

    const result = await addVideo(c.env.DB, {
      title: String(title),
      video_id: String(video_id).trim(),
      description: description ? String(description) : undefined,
      class_type: class_type || undefined,
      thumbnail_url: `https://img.youtube.com/vi/${String(video_id).trim()}/maxresdefault.jpg`
    })

    return c.json({ success: true, id: result.meta?.last_row_id })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// DELETE /api/admin/videos/:id
api.delete('/admin/videos/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, message: '인증이 필요합니다.' }, 401)

  try {
    await initDB(c.env.DB)
    const id = Number(c.req.param('id'))
    await deleteVideo(c.env.DB, id)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, 500)
  }
})

// ===== 공개 API =====
// GET /api/videos - 공개 영상 목록
api.get('/videos', async (c) => {
  try {
    await initDB(c.env.DB)
    const classType = c.req.query('class_type')
    const videos = await getVideos(c.env.DB, classType)
    return c.json({ success: true, videos })
  } catch (error) {
    return c.json({ success: false, videos: [] })
  }
})

export default api
