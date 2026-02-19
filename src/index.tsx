import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'
import home from './routes/home'
import classes from './routes/classes'
import gallery from './routes/gallery'
import reservation from './routes/reservation'
import admin from './routes/admin'
import api from './routes/api'
import type { Env } from './lib/db'

const app = new Hono<{ Bindings: Env }>()

// ===== 정적 파일 서빙 =====
app.use('/static/*', serveStatic())
app.use('/favicon.ico', serveStatic())
app.use('/robots.txt', serveStatic())
app.use('/sitemap.xml', serveStatic())

// ===== API 라우트 =====
app.route('/api', api)

// ===== 페이지 라우트 =====
app.route('/', home)
app.route('/classes', classes)
app.route('/gallery', gallery)
app.route('/reservation', reservation)
app.route('/admin', admin)

// ===== 404 처리 =====
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>404 - 페이지를 찾을 수 없습니다</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&display=swap" rel="stylesheet" />
      <link href="/static/styles.css" rel="stylesheet" />
    </head>
    <body>
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #FFE4ED, #F0E6F8, #E0F7F4); padding: 2rem; text-align: center; font-family: 'Noto Sans KR', sans-serif;">
        <div style="font-size: 5rem; margin-bottom: 1.5rem;">🎨</div>
        <h1 style="font-size: 3rem; font-weight: 700; color: #3D3043; margin-bottom: 0.75rem; letter-spacing: -0.03em;">404</h1>
        <p style="font-size: 1.1rem; color: #7A6E7A; margin-bottom: 2.5rem; line-height: 1.7;">
          찾으시는 페이지가 없습니다.<br />
          URL을 확인하거나 홈으로 돌아가세요.
        </p>
        <a href="/" style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #FF8FAB, #c77daa); color: white; padding: 0.875rem 2rem; border-radius: 999px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 20px rgba(255,143,171,0.4);">
          🏠 홈으로 돌아가기
        </a>
      </div>
    </body>
    </html>
  `, 404)
})

export default app
