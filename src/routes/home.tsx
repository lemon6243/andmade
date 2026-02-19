import { Hono } from 'hono'
import { Layout } from '../renderer'
import type { Env } from '../lib/db'
import { getPosts, getVideos, initDB } from '../lib/db'

const home = new Hono<{ Bindings: Env }>()

home.get('/', async (c) => {
  let recentPosts: any[] = []
  let videos: any[] = []

  try {
    await initDB(c.env.DB)
    recentPosts = await getPosts(c.env.DB, undefined, true) as any[]
    recentPosts = recentPosts.slice(0, 3)
    videos = await getVideos(c.env.DB) as any[]
    videos = videos.slice(0, 6)
  } catch (e) {
    // DB가 없어도 페이지는 표시
  }

  // 유튜브 채널 쇼츠 - 실제 @andmade 채널 영상
  const defaultVideos = [
    { video_id: '3mJO0Di9usI', title: '미니어처 떡국 한 상 차림 ❤️', class_type: 'miniature' },
    { video_id: 'LojCAHwizmE', title: '사장님~ 여기 솜사탕 하나 주세요!', class_type: 'miniature' },
    { video_id: '7_i6OrP186M', title: '누구나 쉽게 하는 백드롭페인팅 ❤️', class_type: 'clay' },
    { video_id: 'rUe_7JlkESc', title: '멍때리고 보게 되는 클레이 장미 만들기', class_type: 'clay' },
  ]
  const displayVideos = videos.length > 0 ? videos : defaultVideos

  return c.html(
    <Layout title="앤드메이드 AND MADE - 서울 장안동 키즈공방">
      {/* ===== 히어로 섹션 ===== */}
      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">✨ 서울 광진구 장안동 키즈공방</div>
          <h1 class="hero-title">
            아이와 함께하는<br />
            <span class="highlight">특별한 만들기</span> 시간
          </h1>
          <p class="hero-subtitle">
            클레이공예 · 미니어처 · 데코덴 · UV레진<br />
            세상에 하나뿐인 나만의 작품을 만들어요 🎨
          </p>
          <div class="hero-cta">
            <a href="/reservation" class="btn-primary">
              <i class="fas fa-calendar-check"></i>
              지금 예약하기
            </a>
            <a href="/classes" class="btn-secondary">
              <i class="fas fa-palette"></i>
              클래스 보기
            </a>
          </div>
          <div class="hero-decorations">
            <div class="hero-deco-card">
              <span class="hero-deco-emoji">🎨</span>
              <div class="hero-deco-label">클레이공예</div>
            </div>
            <div class="hero-deco-card">
              <span class="hero-deco-emoji">🏠</span>
              <div class="hero-deco-label">미니어처</div>
            </div>
            <div class="hero-deco-card">
              <span class="hero-deco-emoji">💎</span>
              <div class="hero-deco-label">데코덴</div>
            </div>
            <div class="hero-deco-card">
              <span class="hero-deco-emoji">✨</span>
              <div class="hero-deco-label">UV레진</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 공방 소개 섹션 ===== */}
      <section class="section">
        <div class="container">
          <div class="section-header fade-in">
            <span class="section-tag">About Us</span>
            <h2 class="section-title">앤드메이드 공방 소개</h2>
            <p class="section-desc">
              앤드메이드는 아이들의 상상력과 창의력을 키워주는<br />
              따뜻하고 안전한 키즈 공방입니다.
            </p>
          </div>
          <div class="features-grid">
            {[
              {
                icon: '🌸',
                title: '안전한 재료',
                desc: '어린이 안전 기준에 적합한 무독성 클레이와 재료만을 사용합니다. 아이가 안심하고 만들 수 있어요.'
              },
              {
                icon: '👩‍🏫',
                title: '전문 선생님',
                desc: '수년간의 경험을 가진 전문 선생님이 1:1로 꼼꼼히 지도합니다. 초보자도 걱정 없어요!'
              },
              {
                icon: '🎁',
                title: '완성 작품 포장',
                desc: '수업 후 완성된 작품을 예쁘게 포장해 드립니다. 소중한 추억을 오래오래 간직하세요.'
              },
              {
                icon: '📸',
                title: '추억 사진 촬영',
                desc: '수업 중 멋진 작품 사진을 촬영해 드립니다. SNS에 자랑하고 싶은 예쁜 사진이 완성돼요!'
              }
            ].map((item) => (
              <div class="feature-card fade-in">
                <span class="feature-icon">{item.icon}</span>
                <h3 class="feature-title">{item.title}</h3>
                <p class="feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 최신 쇼츠 영상 ===== */}
      <section class="section section-alt">
        <div class="container">
          <div class="section-header fade-in">
            <span class="section-tag">YouTube Shorts</span>
            <h2 class="section-title">최신 만들기 영상 🎬</h2>
            <p class="section-desc">
              앤드메이드 유튜브 채널에서 다양한 만들기 영상을 만나보세요!
            </p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
            {displayVideos.map((v: any) => (
              <a
                href={`https://www.youtube.com/shorts/${v.video_id}`}
                target="_blank"
                style="text-decoration: none;"
              >
                <div style="background: #1a1a1a; border-radius: 16px; overflow: hidden; aspect-ratio: 9/16; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: transform 0.3s; cursor: pointer;">
                  <img
                    src={v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/maxresdefault.jpg`}
                    alt={v.title}
                    style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;"
                    onerror={`this.src='https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg'`}
                  />
                  <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem;">
                    <div style="background: #FF0000; color: white; font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 4px; width: fit-content; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem;">
                      <i class="fab fa-youtube"></i> Shorts
                    </div>
                    <p style="color: white; font-size: 0.82rem; font-weight: 600; line-height: 1.4;">{v.title}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div style="text-align: center;">
            <a href="/gallery" class="btn-primary" style="display: inline-flex;">
              <i class="fab fa-youtube"></i>
              모든 영상 보기
            </a>
          </div>
        </div>
      </section>

      {/* ===== 인스타그램 섹션 ===== */}
      <section class="section">
        <div class="container">
          <div class="section-header fade-in">
            <span class="section-tag">Instagram</span>
            <h2 class="section-title">인스타그램 팔로우 📸</h2>
            <p class="section-desc">
              @and._.made 를 팔로우하고 최신 작품 소식을 받아보세요!
            </p>
          </div>
          <div style="max-width: 680px; margin: 0 auto;">
            {/* 인스타그램 임베드 */}
            <div style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); border-radius: 24px; padding: 2.5rem; text-align: center; color: white; box-shadow: 0 8px 32px rgba(131,58,180,0.3);">
              <div style="font-size: 4rem; margin-bottom: 1rem;">📸</div>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">@and._.made</h3>
              <p style="font-size: 0.95rem; opacity: 0.9; margin-bottom: 2rem; line-height: 1.7;">
                매일 새로운 작품 사진과 수업 후기를<br />
                인스타그램에서 공유하고 있어요!
              </p>
              <div style="display: flex; justify-content: center; gap: 2.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700;">1.2K+</div>
                  <div style="font-size: 0.8rem; opacity: 0.8;">팔로워</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700;">200+</div>
                  <div style="font-size: 0.8rem; opacity: 0.8;">게시물</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 1.5rem; font-weight: 700;">💕</div>
                  <div style="font-size: 0.8rem; opacity: 0.8;">높은 인기</div>
                </div>
              </div>
              <a
                href="https://www.instagram.com/and._.made"
                target="_blank"
                style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #833ab4; padding: 0.875rem 2rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 16px rgba(0,0,0,0.2);"
              >
                <i class="fab fa-instagram"></i>
                인스타그램 팔로우하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 공지사항 ===== */}
      {recentPosts.length > 0 && (
        <section class="section section-alt">
          <div class="container">
            <div class="section-header fade-in">
              <span class="section-tag">Notice</span>
              <h2 class="section-title">공지사항 📢</h2>
            </div>
            <div style="max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
              {recentPosts.map((post: any) => (
                <div style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(180,120,160,0.12); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                  <div>
                    <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">{post.title}</h3>
                    <p style="font-size: 0.82rem; color: var(--text-sub);">{new Date(post.created_at as string).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <span style="font-size: 1.5rem;">📢</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 위치/지도 섹션 ===== */}
      <section class="section">
        <div class="container">
          <div class="section-header fade-in">
            <span class="section-tag">Location</span>
            <h2 class="section-title">찾아오시는 길 📍</h2>
            <p class="section-desc">서울 동대문구 장한로26가길 112에 위치해 있습니다.</p>
          </div>

          <div class="map-wrapper fade-in">
            <iframe
              src="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%8F%99%EB%8C%80%EB%AC%B8%EA%B5%AC%20%EC%9E%A5%ED%95%9C%EB%A1%9C26%EA%B0%80%EA%B8%B8%20112%20%EC%95%A4%EB%93%9C%EB%A9%94%EC%9D%B4%EB%93%9C?c=15.00,0,0,0,dh"
              allowfullscreen=""
              loading="lazy"
              title="앤드메이드 위치 - 서울 동대문구 장한로26가길 112"
            ></iframe>
          </div>

          {/* 네이버 플레이스 바로가기 버튼 */}
          <div style="text-align: center; margin: 1.5rem 0;">
            <a
              href="https://naver.me/5S9Q8opQ"
              target="_blank"
              style="display: inline-flex; align-items: center; gap: 0.5rem; background: #03C75A; color: white; padding: 0.75rem 1.75rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 0.9375rem; box-shadow: 0 4px 16px rgba(3,199,90,0.35);"
            >
              <i class="fas fa-map-marker-alt"></i>
              네이버 플레이스에서 보기
            </a>
          </div>

          <div class="location-info-grid">
            {[
              { icon: '📍', title: '주소', text: '서울특별시 동대문구\n장한로26가길 112 앤드메이드' },
              { icon: '🕐', title: '운영시간', text: '매일 09:00 - 19:00\n(연중무휴 · 예약제 운영)' },
              { icon: '💬', title: '카카오톡 채널', text: '앤드메이드 (ID: andmade)\n빠른 상담 가능!' },
              { icon: '📞', title: '예약 문의', text: '인스타그램 @and._.made\n또는 카카오채널로 문의' }
            ].map((item) => (
              <div class="location-info-card fade-in">
                <span class="location-icon">{item.icon}</span>
                <div class="location-text">
                  <h4>{item.title}</h4>
                  <p style="white-space: pre-line;">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 예약 CTA ===== */}
      <section style="background: linear-gradient(135deg, var(--pink-dark), #c77daa, var(--lavender)); padding: 5rem 1.5rem; text-align: center; color: white;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
          <h2 style="font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">
            지금 바로 예약하세요!
          </h2>
          <p style="font-size: 1.05rem; opacity: 0.9; margin-bottom: 2.5rem; line-height: 1.8;">
            원하는 날짜와 클래스를 선택하고<br />
            특별한 만들기 시간을 즐겨보세요 ✨
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/reservation" style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: var(--pink-dark); padding: 0.875rem 2rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
              <i class="fas fa-calendar-check"></i>
              예약하기
            </a>
            <a href="https://pf.kakao.com/_andmade" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.2); color: white; padding: 0.875rem 2rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 1rem; border: 2px solid rgba(255,255,255,0.5);">
              <i class="fas fa-comment"></i>
              카카오톡 문의
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
})

export default home
