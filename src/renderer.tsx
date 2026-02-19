import { jsxRenderer } from 'hono/jsx-renderer'
import { html } from 'hono/html'

export const Layout = ({ children, title = '앤드메이드 AND MADE - 서울 장안동 키즈공방' }: {
  children?: any
  title?: string
}) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="서울 장안동 키즈공방 앤드메이드(AND MADE) - 클레이공예, 미니어처, 데코덴 수업. 아이들과 함께하는 특별한 만들기 시간!" />
        <meta property="og:title" content="앤드메이드 AND MADE - 서울 장안동 키즈공방" />
        <meta property="og:description" content="클레이공예, 미니어처, 데코덴 수업. 아이들과 함께하는 특별한 만들기 시간!" />
        <meta name="theme-color" content="#FFB5C8" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/styles.css" rel="stylesheet" />
      </head>
      <body>
        <nav class="navbar">
          <a href="/" class="navbar-brand">
            <div class="navbar-logo">🎨</div>
            <span class="navbar-title"><span>AND</span> MADE</span>
          </a>
          <ul class="navbar-menu" id="navbar-menu">
            <li><a href="/">홈</a></li>
            <li><a href="/classes">클래스</a></li>
            <li><a href="/gallery">만들기 영상</a></li>
            <li><a href="/reservation">예약하기</a></li>
            <li><a href="/reservation" class="navbar-reserve-btn">
              <i class="fas fa-calendar-check"></i> 예약
            </a></li>
          </ul>
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="메뉴">
            <i class="fas fa-bars" style="font-size: 1.25rem;"></i>
          </button>
        </nav>

        <main>
          {children}
        </main>

        <footer class="footer">
          <div class="footer-grid">
            <div>
              <div class="footer-brand-name">🎨 앤드메이드 AND MADE</div>
              <p class="footer-brand-desc">
                서울 장안동에 위치한 귀여운 키즈공방입니다.<br />
                클레이공예, 미니어처, 데코덴 등<br />
                다양한 만들기 수업을 진행합니다.
              </p>
              <div class="footer-social">
                <a href="https://www.instagram.com/and._.made" target="_blank" class="footer-social-link" title="인스타그램">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="https://www.youtube.com/@andmade" target="_blank" class="footer-social-link" title="유튜브">
                  <i class="fab fa-youtube"></i>
                </a>
                <a href="https://pf.kakao.com/_andmade" target="_blank" class="footer-social-link" title="카카오채널">
                  <i class="fas fa-comment"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 class="footer-col-title">메뉴</h4>
              <ul class="footer-links">
                <li><a href="/">홈</a></li>
                <li><a href="/classes">클래스 소개</a></li>
                <li><a href="/gallery">만들기 영상</a></li>
                <li><a href="/reservation">예약하기</a></li>
              </ul>
            </div>
            <div>
              <h4 class="footer-col-title">수업 안내</h4>
              <ul class="footer-links">
                <li><a href="/classes#clay">클레이공예</a></li>
                <li><a href="/classes#miniature">미니어처</a></li>
                <li><a href="/classes#decoden">데코덴</a></li>
                <li><a href="/classes#uv-resin">UV레진</a></li>
              </ul>
            </div>
            <div>
              <h4 class="footer-col-title">연락처</h4>
              <ul class="footer-links">
                <li><a href="#">📍 서울 동대문구 장한로26가길 112</a></li>
                <li><a href="tel:010-0000-0000">📞 예약 문의</a></li>
                <li><a href="https://pf.kakao.com/_andmade" target="_blank">💬 카카오채널: andmade</a></li>
                <li><a href="#">🕐 매일 09:00-19:00 (예약제)</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2024 앤드메이드(AND MADE). All rights reserved. | 서울 동대문구 장한로26가길 112</p>
          </div>
        </footer>

        <script src="/static/app.js"></script>
      </body>
    </html>
  )
}

export const renderer = jsxRenderer(({ children }) => {
  return <Layout>{children}</Layout>
})
