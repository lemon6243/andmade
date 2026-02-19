import { Hono } from 'hono'
import { Layout } from '../renderer'
import type { Env } from '../lib/db'
import { getVideos, initDB } from '../lib/db'

const gallery = new Hono<{ Bindings: Env }>()

// 기본 유튜브 쇼츠 영상 (실제 @andmade 채널 연동 예시)
const DEFAULT_SHORTS = [
  { video_id: 'u2gfHIkGpSk', title: '클레이 케이크 만들기 🎂', class_type: 'clay' },
  { video_id: 'TLl-Ah5gUZM', title: '미니어처 디저트 🍰', class_type: 'miniature' },
  { video_id: 'VDt-5yOkKLI', title: '데코덴 폰케이스 💎', class_type: 'decoden' },
  { video_id: 'dKWHQFxl9Ow', title: '클레이 동물 만들기 🐱', class_type: 'clay' },
  { video_id: 'SoxQLs57x0M', title: 'UV 레진 액세서리 ✨', class_type: 'uv-resin' },
  { video_id: 'H7Lr3qOLVGQ', title: '미니어처 음식 🍱', class_type: 'miniature' },
  { video_id: '9c1HUFHzYuE', title: '클레이 꽃 만들기 🌸', class_type: 'clay' },
  { video_id: 'Hqp7l6Ip2vc', title: '데코덴 미러 만들기 🪞', class_type: 'decoden' },
  { video_id: 'MwsXeGTBPhM', title: '키즈 클레이 🌈', class_type: 'kids-special' },
]

gallery.get('/', async (c) => {
  let videos: any[] = []
  try {
    await initDB(c.env.DB)
    videos = await getVideos(c.env.DB) as any[]
  } catch (e) { }

  const displayVideos = videos.length > 0 ? videos : DEFAULT_SHORTS
  const filter = c.req.query('filter') || 'all'

  const filteredVideos = filter === 'all'
    ? displayVideos
    : displayVideos.filter((v: any) => v.class_type === filter)

  const categories = [
    { id: 'all', label: '전체', emoji: '🎨' },
    { id: 'clay', label: '클레이', emoji: '🏺' },
    { id: 'miniature', label: '미니어처', emoji: '🏠' },
    { id: 'decoden', label: '데코덴', emoji: '💎' },
    { id: 'uv-resin', label: 'UV레진', emoji: '✨' },
    { id: 'kids-special', label: '키즈', emoji: '🌈' },
  ]

  return c.html(
    <Layout title="만들기 영상 갤러리 - 앤드메이드 AND MADE">
      {/* 페이지 헤더 */}
      <div class="page-header">
        <div class="hero-badge">
          <i class="fab fa-youtube" style="color: #FF0000;"></i>
          유튜브 쇼츠
        </div>
        <h1 class="page-header-title">만들기 영상 갤러리</h1>
        <p class="page-header-desc">
          앤드메이드의 귀여운 만들기 영상을 감상하세요!<br />
          유튜브 채널을 구독하면 새 영상을 빠르게 받아볼 수 있어요 🎬
        </p>
      </div>

      <section class="section">
        <div class="container">
          {/* 유튜브 채널 구독 배너 */}
          <div class="fade-in" style="background: linear-gradient(135deg, #FF0000, #cc0000); border-radius: 20px; padding: 1.75rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; margin-bottom: 3rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fab fa-youtube" style="color: #FF0000; font-size: 1.75rem;"></i>
              </div>
              <div>
                <h3 style="color: white; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">@andmade 채널 구독하기</h3>
                <p style="color: rgba(255,255,255,0.85); font-size: 0.875rem;">새로운 만들기 영상을 가장 빠르게 받아보세요!</p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@andmade"
              target="_blank"
              style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #FF0000; padding: 0.75rem 1.75rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 0.9375rem; white-space: nowrap; flex-shrink: 0;"
            >
              <i class="fas fa-bell"></i>
              구독하기
            </a>
          </div>

          {/* 카테고리 필터 */}
          <div class="fade-in" style="display: flex; flex-wrap: wrap; gap: 0.625rem; justify-content: center; margin-bottom: 2.5rem;">
            {categories.map((cat) => (
              <a
                href={`/gallery?filter=${cat.id}`}
                style={`display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1.25rem; border-radius: 999px; text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; ${
                  filter === cat.id
                    ? 'background: var(--pink-dark); color: white; box-shadow: 0 4px 12px rgba(255,143,171,0.4);'
                    : 'background: white; color: var(--text-sub); box-shadow: var(--shadow-sm);'
                }`}
              >
                {cat.emoji} {cat.label}
              </a>
            ))}
          </div>

          {/* 영상 그리드 */}
          {filteredVideos.length > 0 ? (
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem;">
              {filteredVideos.map((v: any) => (
                <a
                  href={`https://www.youtube.com/shorts/${v.video_id}`}
                  target="_blank"
                  style="text-decoration: none; display: block;"
                >
                  <div style="border-radius: 16px; overflow: hidden; aspect-ratio: 9/16; position: relative; background: #1a1a1a; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: transform 0.3s, box-shadow 0.3s; cursor: pointer;"
                    onmouseover="this.style.transform='translateY(-6px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(0,0,0,0.25)'"
                    onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'"
                  >
                    {/* 썸네일 */}
                    <img
                      src={v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/maxresdefault.jpg`}
                      alt={v.title}
                      style="width: 100%; height: 100%; object-fit: cover; display: block;"
                      loading="lazy"
                      onerror={`this.onerror=null; this.src='https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg'`}
                    />
                    {/* 오버레이 */}
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);">
                    </div>
                    {/* Shorts 배지 */}
                    <div style="position: absolute; top: 10px; left: 10px; background: #FF0000; color: white; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; display: flex; align-items: center; gap: 0.25rem;">
                      <i class="fab fa-youtube"></i> Shorts
                    </div>
                    {/* 재생 버튼 */}
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 48px; height: 48px; background: rgba(255,255,255,0.25); backdrop-filter: blur(4px); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-play" style="color: white; font-size: 1rem; margin-left: 3px;"></i>
                    </div>
                    {/* 제목 */}
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem;">
                      <p style="color: white; font-size: 0.82rem; font-weight: 600; line-height: 1.4;">{v.title}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-sub);">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
              <p style="font-size: 1rem; font-weight: 500;">해당 카테고리의 영상이 없습니다.</p>
              <a href="/gallery" style="display: inline-block; margin-top: 1rem; color: var(--pink-dark); font-weight: 600; text-decoration: none;">전체 영상 보기 →</a>
            </div>
          )}

          {/* 유튜브 채널 방문 CTA */}
          <div class="fade-in" style="text-align: center; margin-top: 3.5rem; padding: 3rem; background: var(--pink-light); border-radius: 24px;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎥</div>
            <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.625rem;">더 많은 영상이 유튜브에 있어요!</h3>
            <p style="font-size: 0.9rem; color: var(--text-sub); margin-bottom: 1.75rem; line-height: 1.7;">
              앤드메이드 유튜브 채널에서 다양한 만들기 영상을 확인하고<br />
              구독 버튼을 눌러 새 영상 알림을 받아보세요!
            </p>
            <a
              href="https://www.youtube.com/@andmade"
              target="_blank"
              class="btn-primary"
              style="display: inline-flex; background: #FF0000;"
            >
              <i class="fab fa-youtube"></i>
              채널 방문하기
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
})

export default gallery
