import { Hono } from 'hono'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { Layout } from '../renderer'
import type { Env } from '../lib/db'
import {
  getReservations, updateReservationStatus, deleteReservation,
  getPosts, createPost, updatePost, deletePost,
  getGallery, addGalleryItem, deleteGalleryItem,
  getVideos, addVideo, deleteVideo,
  initDB
} from '../lib/db'

const admin = new Hono<{ Bindings: Env }>()

// ===== 인증 미들웨어 =====
const ADMIN_PASSWORD = 'andmade2024'
const SESSION_TOKEN = 'andmade_admin_session'
const SESSION_VALUE = 'authenticated_v1'

function isAuthenticated(c: any): boolean {
  const token = getCookie(c, SESSION_TOKEN)
  return token === SESSION_VALUE
}

function requireAuth(c: any) {
  if (!isAuthenticated(c)) {
    return c.redirect('/admin/login')
  }
  return null
}

// ===== 어드민 레이아웃 =====
const AdminLayout = ({ children, title = '관리자 - 앤드메이드', currentPage = '' }: {
  children?: any
  title?: string
  currentPage?: string
}) => {
  const menuItems = [
    { href: '/admin', label: '대시보드', icon: 'fas fa-th-large', id: 'dashboard' },
    { href: '/admin/reservations', label: '예약 관리', icon: 'fas fa-calendar-check', id: 'reservations' },
    { href: '/admin/posts', label: '게시글 관리', icon: 'fas fa-edit', id: 'posts' },
    { href: '/admin/gallery', label: '갤러리 관리', icon: 'fas fa-images', id: 'gallery' },
    { href: '/admin/videos', label: '영상 관리', icon: 'fab fa-youtube', id: 'videos' },
  ]

  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/styles.css" rel="stylesheet" />
      </head>
      <body style="background: var(--gray-50);">
        {/* 관리자 헤더 */}
        <div style="background: var(--text-main); height: 64px; display: flex; align-items: center; padding: 0 1.5rem; gap: 1rem; position: sticky; top: 0; z-index: 100; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.875rem;">
            <a href="/" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;">
              <div style="width: 36px; height: 36px; background: linear-gradient(135deg, var(--pink), var(--lavender)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem;">🎨</div>
              <span style="color: white; font-weight: 700; font-size: 1rem;">앤드메이드</span>
            </a>
            <span style="color: rgba(255,255,255,0.3); font-size: 1.2rem;">|</span>
            <span style="color: rgba(255,255,255,0.7); font-size: 0.875rem; font-weight: 500;">관리자 패널</span>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <a href="/" target="_blank" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fas fa-external-link-alt"></i> 사이트 보기
            </a>
            <a href="/admin/logout" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); padding: 0.375rem 0.875rem; border-radius: 8px; text-decoration: none; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s;"
              onmouseover="this.style.background='rgba(255,255,255,0.2)'"
              onmouseout="this.style.background='rgba(255,255,255,0.1)'"
            >
              <i class="fas fa-sign-out-alt"></i> 로그아웃
            </a>
          </div>
        </div>

        <div class="admin-layout">
          {/* 사이드바 */}
          <aside class="admin-sidebar">
            <div class="admin-sidebar-title">메뉴</div>
            <ul class="admin-sidebar-menu">
              {menuItems.map((item) => (
                <li>
                  <a href={item.href} class={currentPage === item.id ? 'active' : ''}>
                    <i class={item.icon}></i>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div class="admin-sidebar-title">바로가기</div>
            <ul class="admin-sidebar-menu">
              <li>
                <a href="https://www.instagram.com/and._.made" target="_blank">
                  <i class="fab fa-instagram" style="color: #e1306c;"></i>
                  인스타그램
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@andmade" target="_blank">
                  <i class="fab fa-youtube" style="color: #FF0000;"></i>
                  유튜브 채널
                </a>
              </li>
              <li>
                <a href="https://pf.kakao.com/_andmade" target="_blank">
                  <i class="fas fa-comment" style="color: #FEE500;"></i>
                  카카오채널
                </a>
              </li>
            </ul>
          </aside>

          {/* 콘텐츠 영역 */}
          <main class="admin-content">
            {children}
          </main>
        </div>
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
}

// ===== 로그인 페이지 =====
admin.get('/login', (c) => {
  if (isAuthenticated(c)) return c.redirect('/admin')
  const error = c.req.query('error')

  return c.html(
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>관리자 로그인 - 앤드메이드</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/styles.css" rel="stylesheet" />
      </head>
      <body>
        <div class="login-page">
          <div class="login-card">
            <div class="login-logo">🎨</div>
            <h1 class="login-title">관리자 로그인</h1>
            <p class="login-sub">앤드메이드 관리자 페이지입니다</p>

            {error && (
              <div style="background: #ffebee; color: #c62828; padding: 0.875rem 1.25rem; border-radius: 10px; font-size: 0.875rem; margin-bottom: 1.5rem; text-align: left; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-circle"></i>
                비밀번호가 올바르지 않습니다.
              </div>
            )}

            <form method="POST" action="/admin/login">
              <div class="form-group" style="text-align: left;">
                <label class="form-label">아이디</label>
                <input
                  type="text"
                  name="username"
                  value="admin"
                  readonly
                  class="form-control"
                  style="background: var(--gray-50);"
                />
              </div>
              <div class="form-group" style="text-align: left;">
                <label class="form-label">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  class="form-control"
                  placeholder="관리자 비밀번호"
                  autofocus
                  required
                />
              </div>
              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 0.5rem;">
                <i class="fas fa-sign-in-alt"></i>
                로그인
              </button>
            </form>

            <p style="font-size: 0.78rem; color: var(--text-sub); margin-top: 1.5rem;">
              기본 비밀번호: andmade2024
            </p>
          </div>
        </div>
      </body>
    </html>
  )
})

admin.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const password = body.password as string

  if (password === ADMIN_PASSWORD) {
    setCookie(c, SESSION_TOKEN, SESSION_VALUE, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7 // 7일
    })
    return c.redirect('/admin')
  }

  return c.redirect('/admin/login?error=1')
})

admin.get('/logout', (c) => {
  deleteCookie(c, SESSION_TOKEN)
  return c.redirect('/admin/login')
})

// ===== 대시보드 =====
admin.get('/', async (c) => {
  const auth = requireAuth(c)
  if (auth) return auth

  let stats = { reservations: 0, pending: 0, posts: 0, gallery: 0, videos: 0 }
  let recentReservations: any[] = []

  try {
    await initDB(c.env.DB)
    const allRes = await getReservations(c.env.DB) as any[]
    const pendingRes = await getReservations(c.env.DB, 'pending') as any[]
    const posts = await getPosts(c.env.DB) as any[]
    const galleryItems = await getGallery(c.env.DB) as any[]
    const videos = await getVideos(c.env.DB) as any[]

    stats = {
      reservations: allRes.length,
      pending: pendingRes.length,
      posts: posts.length,
      gallery: galleryItems.length,
      videos: videos.length
    }
    recentReservations = allRes.slice(0, 5)
  } catch (e) { }

  const statusLabels: { [key: string]: string } = {
    pending: '대기중', confirmed: '확정', cancelled: '취소', completed: '완료'
  }
  const statusBadge: { [key: string]: string } = {
    pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled', completed: 'badge-completed'
  }

  return c.html(
    <AdminLayout title="대시보드 - 앤드메이드 관리자" currentPage="dashboard">
      <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">대시보드 👋</h1>
      <p style="color: var(--text-sub); font-size: 0.875rem; margin-bottom: 2rem;">앤드메이드 공방 운영 현황</p>

      {/* 통계 */}
      <div class="stats-grid">
        <div class="stat-card">
          <div style="font-size: 2rem;">📅</div>
          <div class="stat-value">{stats.reservations}</div>
          <div class="stat-label">총 예약</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--yellow);">
          <div style="font-size: 2rem;">⏳</div>
          <div class="stat-value" style="color: var(--pink-dark);">{stats.pending}</div>
          <div class="stat-label">대기중 예약</div>
        </div>
        <div class="stat-card">
          <div style="font-size: 2rem;">📝</div>
          <div class="stat-value">{stats.posts}</div>
          <div class="stat-label">게시글</div>
        </div>
        <div class="stat-card">
          <div style="font-size: 2rem;">🖼️</div>
          <div class="stat-value">{stats.gallery}</div>
          <div class="stat-label">갤러리 작품</div>
        </div>
        <div class="stat-card">
          <div style="font-size: 2rem;">🎬</div>
          <div class="stat-value">{stats.videos}</div>
          <div class="stat-label">등록 영상</div>
        </div>
      </div>

      {/* 최근 예약 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-calendar-check" style="color: var(--pink-dark);"></i>
          최근 예약
          <a href="/admin/reservations" style="margin-left: auto; font-size: 0.8rem; color: var(--pink-dark); text-decoration: none; font-weight: 500;">전체 보기 →</a>
        </div>
        {recentReservations.length > 0 ? (
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>클래스</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>인원</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r: any) => (
                  <tr>
                    <td style="font-weight: 600;">{r.name}</td>
                    <td>{r.class_type}</td>
                    <td>{r.class_date}</td>
                    <td>{r.class_time}</td>
                    <td>{r.participants}명</td>
                    <td>
                      <span class={`badge ${statusBadge[r.status] || 'badge-pending'}`}>
                        {statusLabels[r.status] || r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style="text-align: center; padding: 2.5rem; color: var(--text-sub);">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📅</div>
            <p>아직 예약이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 빠른 작업 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-bolt" style="color: var(--pink-dark);"></i>
          빠른 작업
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.875rem;">
          {[
            { href: '/admin/reservations', icon: 'fas fa-calendar-check', label: '예약 관리', color: 'var(--pink-light)', textColor: 'var(--pink-dark)' },
            { href: '/admin/posts', icon: 'fas fa-edit', label: '게시글 작성', color: 'var(--mint-light)', textColor: '#2e7d72' },
            { href: '/admin/gallery', icon: 'fas fa-images', label: '갤러리 등록', color: 'var(--lavender-light)', textColor: '#6a1b9a' },
            { href: '/admin/videos', icon: 'fab fa-youtube', label: '영상 등록', color: '#ffebee', textColor: '#c62828' },
          ].map((item) => (
            <a
              href={item.href}
              style={`display: flex; align-items: center; gap: 0.625rem; background: ${item.color}; color: ${item.textColor}; padding: 0.875rem 1.25rem; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 0.875rem; transition: transform 0.2s;`}
              onmouseover="this.style.transform='translateY(-2px)'"
              onmouseout="this.style.transform=''"
            >
              <i class={item.icon}></i>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
})

// ===== 예약 관리 =====
admin.get('/reservations', async (c) => {
  const auth = requireAuth(c)
  if (auth) return auth

  let reservations: any[] = []
  const statusFilter = c.req.query('status') || 'all'

  try {
    await initDB(c.env.DB)
    reservations = await getReservations(
      c.env.DB,
      statusFilter !== 'all' ? statusFilter : undefined
    ) as any[]
  } catch (e) { }

  const statusLabels: { [key: string]: string } = {
    pending: '대기중', confirmed: '확정', cancelled: '취소', completed: '완료'
  }
  const statusBadge: { [key: string]: string } = {
    pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled', completed: 'badge-completed'
  }
  const classLabels: { [key: string]: string } = {
    clay: '🏺 클레이', miniature: '🏠 미니어처', decoden: '💎 데코덴',
    'uv-resin': '✨ UV레진', 'kids-special': '🌈 키즈', private: '👑 프라이빗'
  }

  return c.html(
    <AdminLayout title="예약 관리 - 앤드메이드 관리자" currentPage="reservations">
      <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">예약 관리</h1>
      <p style="color: var(--text-sub); font-size: 0.875rem; margin-bottom: 2rem;">총 {reservations.length}건의 예약</p>

      {/* 상태 필터 */}
      <div style="display: flex; gap: 0.625rem; flex-wrap: wrap; margin-bottom: 2rem;">
        {[
          { value: 'all', label: '전체' },
          { value: 'pending', label: '대기중' },
          { value: 'confirmed', label: '확정' },
          { value: 'completed', label: '완료' },
          { value: 'cancelled', label: '취소' },
        ].map((s) => (
          <a
            href={`/admin/reservations?status=${s.value}`}
            style={`padding: 0.5rem 1.125rem; border-radius: 999px; text-decoration: none; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; ${
              statusFilter === s.value
                ? 'background: var(--pink-dark); color: white;'
                : 'background: white; color: var(--text-sub); box-shadow: var(--shadow-sm);'
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>

      <div class="admin-card">
        {reservations.length > 0 ? (
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>클래스</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>인원</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r: any) => (
                  <tr>
                    <td style="color: var(--text-sub);">#{r.id}</td>
                    <td style="font-weight: 600;">{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{classLabels[r.class_type] || r.class_type}</td>
                    <td>{r.class_date}</td>
                    <td>{r.class_time}</td>
                    <td>{r.participants}명</td>
                    <td>
                      <span class={`badge ${statusBadge[r.status] || 'badge-pending'}`}>
                        {statusLabels[r.status] || r.status}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
                        {r.status === 'pending' && (
                          <button
                            class="btn-sm btn-confirm"
                            data-action="update-reservation-status"
                            data-id={String(r.id)}
                            data-status="confirmed"
                          >확정</button>
                        )}
                        {(r.status === 'pending' || r.status === 'confirmed') && (
                          <button
                            class="btn-sm btn-cancel"
                            data-action="update-reservation-status"
                            data-id={String(r.id)}
                            data-status="cancelled"
                          >취소</button>
                        )}
                        {r.status === 'confirmed' && (
                          <button
                            class="btn-sm"
                            style="background: var(--lavender-light); color: #6a1b9a;"
                            data-action="update-reservation-status"
                            data-id={String(r.id)}
                            data-status="completed"
                          >완료</button>
                        )}
                        <button
                          class="btn-sm btn-delete"
                          data-action="delete-reservation"
                          data-id={String(r.id)}
                        >삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style="text-align: center; padding: 3rem; color: var(--text-sub);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
            <p>예약 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
})

// ===== 게시글 관리 =====
admin.get('/posts', async (c) => {
  const auth = requireAuth(c)
  if (auth) return auth

  let posts: any[] = []
  try {
    await initDB(c.env.DB)
    posts = await getPosts(c.env.DB) as any[]
  } catch (e) { }

  return c.html(
    <AdminLayout title="게시글 관리 - 앤드메이드 관리자" currentPage="posts">
      <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">게시글 관리</h1>
      <p style="color: var(--text-sub); font-size: 0.875rem; margin-bottom: 2rem;">공지사항 및 게시글을 관리합니다.</p>

      {/* 글쓰기 폼 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-plus" style="color: var(--pink-dark);"></i>
          새 게시글 작성
        </div>
        <form id="post-form">
          <input type="hidden" name="id" value="" />
          <div class="form-group">
            <label class="form-label">제목 <span class="required">*</span></label>
            <input type="text" name="title" class="form-control" placeholder="게시글 제목" required />
          </div>
          <div class="form-group">
            <label class="form-label">카테고리</label>
            <select name="category" class="form-control">
              <option value="notice">공지사항</option>
              <option value="event">이벤트</option>
              <option value="class">클래스 안내</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">내용 <span class="required">*</span></label>
            <textarea name="content" class="form-control" rows={5} placeholder="게시글 내용을 입력해주세요." required></textarea>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button type="submit" class="btn-primary" style="display: inline-flex; padding: 0.75rem 1.75rem;">
              <i class="fas fa-save"></i>
              저장
            </button>
          </div>
        </form>
      </div>

      {/* 게시글 목록 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-list" style="color: var(--pink-dark);"></i>
          게시글 목록 ({posts.length}개)
        </div>
        {posts.length > 0 ? (
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>게시 상태</th>
                  <th>작성일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p: any) => (
                  <tr>
                    <td style="color: var(--text-sub);">#{p.id}</td>
                    <td style="font-weight: 600; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{p.title}</td>
                    <td>
                      <span class="badge badge-confirmed">{p.category}</span>
                    </td>
                    <td>
                      <span class={`badge ${p.published ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {p.published ? '게시중' : '비게시'}
                      </span>
                    </td>
                    <td style="color: var(--text-sub);">
                      {new Date(p.created_at as string).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      <button
                        class="btn-sm btn-delete"
                        data-action="delete-post"
                        data-id={String(p.id)}
                      >삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style="text-align: center; padding: 2.5rem; color: var(--text-sub);">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📝</div>
            <p>게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
})

// ===== 갤러리 관리 =====
admin.get('/gallery', async (c) => {
  const auth = requireAuth(c)
  if (auth) return auth

  let galleryItems: any[] = []
  try {
    await initDB(c.env.DB)
    galleryItems = await getGallery(c.env.DB) as any[]
  } catch (e) { }

  return c.html(
    <AdminLayout title="갤러리 관리 - 앤드메이드 관리자" currentPage="gallery">
      <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">갤러리 관리</h1>
      <p style="color: var(--text-sub); font-size: 0.875rem; margin-bottom: 2rem;">작품 사진을 등록하고 관리합니다.</p>

      {/* 갤러리 등록 폼 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-plus" style="color: var(--pink-dark);"></i>
          갤러리 항목 추가
        </div>
        <form id="gallery-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">제목 <span class="required">*</span></label>
              <input type="text" id="gallery-title" class="form-control" placeholder="작품 제목" required />
            </div>
            <div class="form-group">
              <label class="form-label">카테고리</label>
              <select id="gallery-category" class="form-control">
                <option value="general">일반</option>
                <option value="clay">클레이</option>
                <option value="miniature">미니어처</option>
                <option value="decoden">데코덴</option>
                <option value="uv-resin">UV레진</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">이미지 URL <span class="required">*</span></label>
            <input type="url" id="gallery-image-url" class="form-control" placeholder="https://... (이미지 직접 URL)" required />
            <p class="form-hint">※ 이미지 URL을 직접 입력하거나, imgur, imgbb 등에 업로드 후 URL을 사용하세요.</p>
          </div>
          <div class="form-group">
            <label class="form-label">설명</label>
            <input type="text" id="gallery-desc" class="form-control" placeholder="작품 설명 (선택)" />
          </div>
          <button type="button" class="btn-primary" style="display: inline-flex;" onclick="submitGallery()">
            <i class="fas fa-plus"></i>
            갤러리에 추가
          </button>
        </form>
      </div>

      {/* 갤러리 목록 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-images" style="color: var(--pink-dark);"></i>
          등록된 작품 ({galleryItems.length}개)
        </div>
        {galleryItems.length > 0 ? (
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem;">
            {galleryItems.map((item: any) => (
              <div style="background: var(--gray-50); border-radius: 12px; overflow: hidden; border: 2px solid var(--gray-100);">
                <div style="aspect-ratio: 1; overflow: hidden; background: var(--gray-100);">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style="width: 100%; height: 100%; object-fit: cover;"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div style="padding: 0.75rem;">
                  <p style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{item.title}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge badge-confirmed" style="font-size: 0.7rem;">{item.category}</span>
                    <button
                      class="btn-sm btn-delete"
                      style="font-size: 0.72rem; padding: 0.2rem 0.5rem;"
                      data-action="delete-gallery"
                      data-id={String(item.id)}
                    >삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style="text-align: center; padding: 2.5rem; color: var(--text-sub);">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🖼️</div>
            <p>등록된 작품이 없습니다.</p>
          </div>
        )}
      </div>

      <script>{`
        async function submitGallery() {
          const title = document.getElementById('gallery-title').value;
          const imageUrl = document.getElementById('gallery-image-url').value;
          const category = document.getElementById('gallery-category').value;
          const desc = document.getElementById('gallery-desc').value;

          if (!title || !imageUrl) {
            alert('제목과 이미지 URL을 입력해주세요.');
            return;
          }

          try {
            const res = await fetch('/api/admin/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, image_url: imageUrl, category, description: desc })
            });
            const result = await res.json();
            if (result.success) {
              alert('갤러리에 추가되었습니다!');
              location.reload();
            } else {
              alert('오류가 발생했습니다: ' + result.message);
            }
          } catch (e) {
            alert('오류가 발생했습니다.');
          }
        }
      `}</script>
    </AdminLayout>
  )
})

// ===== 유튜브 영상 관리 =====
admin.get('/videos', async (c) => {
  const auth = requireAuth(c)
  if (auth) return auth

  let videos: any[] = []
  try {
    await initDB(c.env.DB)
    videos = await getVideos(c.env.DB) as any[]
  } catch (e) { }

  return c.html(
    <AdminLayout title="영상 관리 - 앤드메이드 관리자" currentPage="videos">
      <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">유튜브 영상 관리</h1>
      <p style="color: var(--text-sub); font-size: 0.875rem; margin-bottom: 2rem;">유튜브 쇼츠 영상을 수동 등록합니다.</p>

      {/* 영상 등록 폼 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fab fa-youtube" style="color: #FF0000;"></i>
          유튜브 영상 등록
        </div>
        <form id="video-form">
          <div class="form-group">
            <label class="form-label">유튜브 URL 또는 Video ID</label>
            <input
              type="text"
              id="video-url-input"
              class="form-control"
              placeholder="https://www.youtube.com/shorts/XXXXX 또는 Video ID 직접 입력"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Video ID <span class="required">*</span></label>
            <input
              type="text"
              name="video_id"
              id="video-id-input"
              class="form-control"
              placeholder="유튜브 Video ID (11자리)"
              required
            />
            <p class="form-hint">위에 URL을 입력하면 자동으로 추출됩니다.</p>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">영상 제목 <span class="required">*</span></label>
              <input type="text" name="title" class="form-control" placeholder="영상 제목" required />
            </div>
            <div class="form-group">
              <label class="form-label">관련 클래스</label>
              <select name="class_type" class="form-control">
                <option value="">없음 (메인 노출)</option>
                <option value="clay">클레이공예</option>
                <option value="miniature">미니어처</option>
                <option value="decoden">데코덴</option>
                <option value="uv-resin">UV레진</option>
                <option value="kids-special">키즈 스페셜</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">설명</label>
            <input type="text" name="description" class="form-control" placeholder="영상 설명 (선택)" />
          </div>
          <button type="submit" class="btn-primary" style="display: inline-flex; background: #FF0000;">
            <i class="fab fa-youtube"></i>
            영상 등록
          </button>
        </form>
      </div>

      {/* 등록된 영상 목록 */}
      <div class="admin-card">
        <div class="admin-card-title">
          <i class="fas fa-list" style="color: var(--pink-dark);"></i>
          등록된 영상 ({videos.length}개)
        </div>
        {videos.length > 0 ? (
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
            {videos.map((v: any) => (
              <div style="background: var(--gray-50); border-radius: 12px; overflow: hidden; border: 2px solid var(--gray-100);">
                <div style="aspect-ratio: 9/16; max-height: 200px; overflow: hidden; background: #1a1a1a; position: relative;">
                  <img
                    src={v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`}
                    alt={v.title}
                    style="width: 100%; height: 100%; object-fit: cover;"
                  />
                  <div style="position: absolute; top: 6px; left: 6px; background: #FF0000; color: white; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 3px;">
                    Shorts
                  </div>
                </div>
                <div style="padding: 0.75rem;">
                  <p style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.375rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{v.title}</p>
                  <p style="font-size: 0.72rem; color: var(--text-sub); margin-bottom: 0.5rem;">ID: {v.video_id}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    {v.class_type && (
                      <span class="badge badge-confirmed" style="font-size: 0.7rem;">{v.class_type}</span>
                    )}
                    <button
                      class="btn-sm btn-delete"
                      style="font-size: 0.72rem; padding: 0.2rem 0.5rem; margin-left: auto;"
                      data-action="delete-video"
                      data-id={String(v.id)}
                    >삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style="text-align: center; padding: 2.5rem; color: var(--text-sub);">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🎬</div>
            <p>등록된 영상이 없습니다.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
})

export default admin
