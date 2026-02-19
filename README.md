# 🎨 앤드메이드(AND MADE) - 서울 장안동 키즈공방 공식 홈페이지

## 프로젝트 개요
- **공방명**: 앤드메이드(AND MADE)
- **위치**: 서울 광진구 장안동
- **소셜**: 인스타그램 [@and._.made](https://www.instagram.com/and._.made) | 유튜브 [@andmade](https://www.youtube.com/@andmade) | 카카오채널: andmade
- **기술 스택**: Hono + TypeScript + Cloudflare Pages + D1 SQLite
- **디자인**: 따뜻한 파스텔 톤 / 모바일 완전 반응형

---

## ✅ 완성된 기능

### 1. 메인 페이지 (`/`)
- 히어로 배너 (공방 소개, 수업 종류)
- 공방 특징 소개 카드 (안전 재료, 전문 선생님, 작품 포장, 사진 촬영)
- 유튜브 쇼츠 최신 영상 자동 표시 (DB 등록 우선, 기본값 제공)
- 인스타그램 @and._.made 팔로우 유도 배너
- 네이버 지도 임베드 (공방 위치)
- 공지사항 최신 3개 표시
- 예약 CTA 섹션

### 2. 클래스 소개 페이지 (`/classes`)
- 6가지 클래스 상세 카드:
  - 🏺 클레이공예 (₩35,000 / 60-90분 / 5세+)
  - 🏠 미니어처 (₩45,000 / 90-120분 / 7세+)
  - 💎 데코덴 (₩40,000 / 60-90분 / 8세+)
  - ✨ UV레진 (₩38,000 / 60-90분 / 10세+)
  - 🌈 키즈 스페셜 (₩30,000 / 45-60분 / 4-7세)
  - 👑 프라이빗 클래스 (₩80,000~ / 맞춤)
- 포함 사항, 가격, 대상 연령, 소요시간 표시
- 각 클래스별 관련 유튜브 영상 임베드
- FAQ 섹션 (5가지 자주 묻는 질문)

### 3. 만들기 영상 갤러리 (`/gallery`)
- 유튜브 쇼츠 9x2 그리드 레이아웃 (카테고리 필터링)
- 카테고리 필터 (전체 / 클레이 / 미니어처 / 데코덴 / UV레진 / 키즈)
- 썸네일 + 재생 오버레이 + 유튜브 직접 링크
- 유튜브 채널 구독 유도 배너 (@andmade)
- DB에 등록된 영상 우선 표시 (없으면 기본 영상)

### 4. 예약 시스템 (`/reservation`)
- 온라인 예약 폼:
  - 이름, 연락처, 이메일(선택)
  - 클래스 선택 (6종)
  - 날짜 선택 (오늘 이후)
  - 시간 선택 (11:00 ~ 18:00 30분 단위)
  - 인원 선택 (1-8명)
  - 요청사항 메시지
- D1 SQLite DB 저장
- 예약 완료 확인 메시지
- 예약 안내 / 취소환불 정책 표시
- 카카오채널 빠른 문의 CTA

### 5. 관리자 페이지 (`/admin`)
- **로그인**: 아이디 `admin` / 비밀번호 `andmade2024`
- **대시보드**: 총 예약수, 대기 예약, 게시글, 갤러리, 영상 수 통계
- **예약 관리** (`/admin/reservations`):
  - 상태별 필터 (전체/대기중/확정/완료/취소)
  - 예약 확정/취소/완료 처리
  - 예약 삭제
- **게시글 관리** (`/admin/posts`):
  - 공지사항/이벤트/클래스안내 작성
  - 게시글 삭제
- **갤러리 관리** (`/admin/gallery`):
  - 작품 사진 URL 등록
  - 카테고리별 관리
  - 삭제
- **영상 관리** (`/admin/videos`):
  - 유튜브 URL 또는 Video ID 직접 등록
  - 클래스별 연결
  - 삭제

---

## 📁 URI 목록

| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 |
| `/classes` | 클래스 소개 |
| `/gallery` | 영상 갤러리 (쿼리: `?filter=clay`) |
| `/reservation` | 예약 페이지 (쿼리: `?class=clay`) |
| `/admin` | 관리자 대시보드 (로그인 필요) |
| `/admin/login` | 관리자 로그인 |
| `/admin/reservations` | 예약 관리 |
| `/admin/posts` | 게시글 관리 |
| `/admin/gallery` | 갤러리 관리 |
| `/admin/videos` | 영상 관리 |
| `/api/reservations` | POST: 예약 접수 |
| `/api/admin/reservations/:id/status` | PUT: 예약 상태 변경 |
| `/api/admin/posts` | POST/PUT/DELETE: 게시글 관리 |
| `/api/admin/gallery` | POST/DELETE: 갤러리 관리 |
| `/api/admin/videos` | POST/DELETE: 영상 관리 |
| `/api/videos` | GET: 공개 영상 목록 |

---

## 💾 데이터 구조

### DB 테이블 (Cloudflare D1 SQLite)
- `reservations`: 예약 정보 (이름, 연락처, 클래스, 날짜, 시간, 인원, 상태)
- `posts`: 공지사항/게시글 (제목, 내용, 카테고리, 게시 여부)
- `gallery`: 갤러리 작품 사진 (제목, 이미지 URL, 카테고리)
- `youtube_videos`: 유튜브 영상 등록 (Video ID, 제목, 클래스 연결)
- `admins`: 관리자 계정

---

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# DB 마이그레이션
npm run db:migrate:local

# 빌드 후 실행
npm run build
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npx wrangler pages dev dist --d1=DB --local --port 3000
```

---

## ☁️ Cloudflare Pages 배포

```bash
# 1. Cloudflare D1 DB 생성
npx wrangler d1 create andmade-production
# → wrangler.jsonc의 database_id 업데이트

# 2. 프로덕션 마이그레이션
npm run db:migrate:prod

# 3. 빌드 및 배포
npm run deploy:prod
```

---

## 🎨 디자인 시스템

- **주 색상**: 핑크 (#FFB5C8, #FF8FAB), 라벤더 (#D4B8E0), 민트 (#B5E8E0)
- **폰트**: Noto Sans KR (Google Fonts)
- **아이콘**: FontAwesome 6.4.0 (CDN)
- **레이아웃**: CSS Grid + Flexbox, 모바일 완전 반응형

---

*마지막 업데이트: 2026-02-19*
