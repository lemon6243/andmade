import { Hono } from 'hono'
import { Layout } from '../renderer'
import type { Env } from '../lib/db'
import { getVideos, initDB } from '../lib/db'

const classes = new Hono<{ Bindings: Env }>()

const CLASS_DATA = [
  {
    id: 'clay',
    emoji: '🏺',
    name: '클레이공예',
    subtitle: 'Clay Art',
    price: '35,000',
    duration: '60~90분',
    age: '5세 이상',
    maxParticipants: '8명',
    color: 'pink',
    desc: '말랑말랑한 클레이로 귀여운 케이크, 동물, 음식 등 다양한 작품을 만들어요. 손의 감각을 자극하고 창의력을 키워주는 수업입니다.',
    includes: ['무독성 클레이 재료', '도구 일체 제공', '작품 포장', '작품 사진 촬영'],
    tags: ['초보자 환영', '가족 참여', '어린이 추천'],
    tagColors: ['', 'mint', 'lavender'],
    videoIds: []
  },
  {
    id: 'miniature',
    emoji: '🏠',
    name: '미니어처',
    subtitle: 'Miniature Art',
    price: '45,000',
    duration: '90~120분',
    age: '7세 이상',
    maxParticipants: '6명',
    color: 'mint',
    desc: '손바닥만한 작은 세계를 만들어보세요! 미니어처 음식, 가구, 집 등 세밀하고 정교한 작품 제작 수업입니다.',
    includes: ['클레이 및 미니어처 재료', '도구 일체 제공', '작품 포장', '완성 사진 촬영'],
    tags: ['집중력 향상', '세밀 작업', '소그룹 수업'],
    tagColors: ['lavender', '', 'mint'],
    videoIds: []
  },
  {
    id: 'decoden',
    emoji: '💎',
    name: '데코덴',
    subtitle: 'Decoden',
    price: '40,000',
    duration: '60~90분',
    age: '8세 이상',
    maxParticipants: '8명',
    color: 'lavender',
    desc: '달콤한 디저트 모양 장식으로 폰케이스, 미러, 파우치 등을 꾸미는 수업입니다. 나만의 귀여운 소품을 만들 수 있어요!',
    includes: ['데코덴 크림 및 장식 재료', '케이스/소품 제공', '완성 포장', '인증 사진 촬영'],
    tags: ['10대 인기', 'SNS 감성', '개성 표현'],
    tagColors: ['', 'yellow', 'lavender'],
    videoIds: []
  },
  {
    id: 'uv-resin',
    emoji: '✨',
    name: 'UV레진',
    subtitle: 'UV Resin',
    price: '38,000',
    duration: '60~90분',
    age: '10세 이상',
    maxParticipants: '6명',
    color: 'yellow',
    desc: 'UV레진으로 반짝이는 액세서리와 소품을 만들어요. 꽃, 반짝이, 작은 장식을 넣어 나만의 특별한 작품을 만들 수 있습니다.',
    includes: ['UV레진 및 장식 재료', 'UV램프 사용', '완성 포장', '작품 사진 촬영'],
    tags: ['반짝이 작품', '액세서리 제작', '청소년 인기'],
    tagColors: ['yellow', '', 'mint'],
    videoIds: []
  },
  {
    id: 'kids-special',
    emoji: '🌈',
    name: '키즈 스페셜',
    subtitle: 'Kids Special',
    price: '30,000',
    duration: '45~60분',
    age: '4~7세',
    maxParticipants: '6명',
    color: 'pink',
    desc: '어린 친구들을 위한 특별 수업! 간단하고 재미있는 만들기로 아이들의 첫 공예 경험을 즐겁게 만들어드려요.',
    includes: ['안전 재료 100%', '부모 동반 가능', '완성 작품 포장', '기념 사진 촬영'],
    tags: ['4-7세 전용', '부모 동반 가능', '안전 재료'],
    tagColors: ['', 'mint', 'lavender'],
    videoIds: []
  },
  {
    id: 'private',
    emoji: '👑',
    name: '프라이빗 클래스',
    subtitle: 'Private Class',
    price: '80,000~',
    duration: '원하는 시간',
    age: '전 연령',
    maxParticipants: '최대 4명',
    color: 'lavender',
    desc: '생일파티, 돌잔치, 가족 모임을 위한 프라이빗 클래스입니다. 원하는 테마와 시간으로 맞춤 수업을 진행합니다.',
    includes: ['맞춤 테마 수업', '장식 포함', '케이터링 협의 가능', '특별 포장 서비스'],
    tags: ['생일파티 추천', '단체 할인', '맞춤 제작'],
    tagColors: ['', 'yellow', 'lavender'],
    videoIds: []
  }
]

classes.get('/', async (c) => {
  let videos: any[] = []
  try {
    await initDB(c.env.DB)
    videos = await getVideos(c.env.DB) as any[]
  } catch (e) { }

  // 클래스별 영상 매핑
  const videosByClass: { [key: string]: any[] } = {}
  videos.forEach((v: any) => {
    if (v.class_type) {
      if (!videosByClass[v.class_type]) videosByClass[v.class_type] = []
      videosByClass[v.class_type].push(v)
    }
  })

  return c.html(
    <Layout title="클래스 소개 - 앤드메이드 AND MADE">
      {/* 페이지 헤더 */}
      <div class="page-header">
        <div class="hero-badge">🎨 다양한 수업 프로그램</div>
        <h1 class="page-header-title">클래스 소개</h1>
        <p class="page-header-desc">
          아이들의 창의력을 키워주는 다양한 만들기 수업을<br />
          소개해 드릴게요 ✨
        </p>
      </div>

      {/* 클래스 목록 */}
      <section class="section">
        <div class="container">
          <div class="classes-grid">
            {CLASS_DATA.map((cls) => {
              const clsVideos = videosByClass[cls.id] || []
              return (
                <div class="class-card fade-in" id={cls.id}>
                  <div class="class-card-header" style={`background: linear-gradient(135deg, var(--${cls.color === 'pink' ? 'pink' : cls.color === 'mint' ? 'mint' : cls.color === 'lavender' ? 'lavender' : 'yellow'}-light), var(--${cls.color === 'pink' ? 'pink' : cls.color === 'mint' ? 'mint' : cls.color === 'lavender' ? 'lavender' : 'yellow'}-light));`}>
                    <span class="class-emoji">{cls.emoji}</span>
                    <h2 class="class-name">{cls.name}</h2>
                    <p class="class-subtitle">{cls.subtitle}</p>
                  </div>

                  <div class="class-info">
                    <div class="class-info-item">
                      <i class="fas fa-clock" style="color: var(--pink-dark);"></i>
                      {cls.duration}
                    </div>
                    <div class="class-info-item">
                      <i class="fas fa-user" style="color: var(--pink-dark);"></i>
                      {cls.age}
                    </div>
                    <div class="class-info-item">
                      <i class="fas fa-users" style="color: var(--pink-dark);"></i>
                      {cls.maxParticipants}
                    </div>
                  </div>

                  <div class="class-body">
                    <p class="class-desc">{cls.desc}</p>

                    <div class="class-price">
                      <span class="class-price-label">수업 금액</span>
                      <span class="class-price-amount">₩{cls.price}</span>
                    </div>

                    <div style="margin-bottom: 1.25rem;">
                      <p style="font-size: 0.82rem; font-weight: 600; color: var(--text-sub); margin-bottom: 0.75rem;">포함 사항</p>
                      <div style="display: flex; flex-direction: column; gap: 0.375rem;">
                        {cls.includes.map((item) => (
                          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-main);">
                            <span style="color: var(--pink-dark);">✓</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div class="class-tags" style="margin-bottom: 1.25rem;">
                      {cls.tags.map((tag, i) => (
                        <span class={`tag ${cls.tagColors[i] ? `tag-${cls.tagColors[i]}` : ''}`}>{tag}</span>
                      ))}
                    </div>

                    {/* 관련 유튜브 영상 */}
                    {clsVideos.length > 0 && (
                      <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-100);">
                        <p style="font-size: 0.82rem; font-weight: 600; color: var(--text-sub); margin-bottom: 0.875rem; display: flex; align-items: center; gap: 0.4rem;">
                          <i class="fab fa-youtube" style="color: #FF0000;"></i>
                          관련 영상
                        </p>
                        <div style="display: flex; gap: 0.75rem; overflow-x: auto;">
                          {clsVideos.slice(0, 2).map((v: any) => (
                            <a
                              href={`https://www.youtube.com/shorts/${v.video_id}`}
                              target="_blank"
                              style="flex-shrink: 0; width: 100px; text-decoration: none;"
                            >
                              <div style="aspect-ratio: 9/16; border-radius: 10px; overflow: hidden; background: #000; position: relative;">
                                <img
                                  src={`https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`}
                                  alt={v.title}
                                  style="width: 100%; height: 100%; object-fit: cover;"
                                />
                                <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3);">
                                  <div style="width: 28px; height: 28px; background: #FF0000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-play" style="color: white; font-size: 0.7rem; margin-left: 2px;"></i>
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <a href="/reservation" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 1.25rem; font-size: 0.9375rem;">
                      <i class="fas fa-calendar-check"></i>
                      이 수업 예약하기
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section class="section section-alt">
        <div class="container">
          <div class="section-header fade-in">
            <span class="section-tag">FAQ</span>
            <h2 class="section-title">자주 묻는 질문 💬</h2>
          </div>
          <div style="max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
            {[
              {
                q: '예약은 어떻게 하나요?',
                a: '웹사이트 예약 페이지에서 원하는 날짜, 시간, 클래스를 선택해 예약하시거나 카카오톡 채널 "앤드메이드"로 문의해 주세요.'
              },
              {
                q: '준비물이 있나요?',
                a: '별도의 준비물 없이 오시면 됩니다! 모든 재료와 도구는 공방에서 제공해드립니다.'
              },
              {
                q: '부모님도 함께 수업받을 수 있나요?',
                a: '물론이죠! 부모님과 아이가 함께 참여하는 수업도 진행합니다. 특히 키즈 스페셜 클래스는 부모 동반을 추천드립니다.'
              },
              {
                q: '취소 및 환불 정책은 어떻게 되나요?',
                a: '수업 24시간 전 취소 시 전액 환불, 12시간 전 50% 환불이 가능합니다. 당일 취소는 환불이 어렵습니다.'
              },
              {
                q: '단체 예약도 가능한가요?',
                a: '네! 단체 예약(5인 이상)은 프라이빗 클래스로 진행 가능합니다. 카카오채널로 문의해 주시면 맞춤 견적을 드립니다.'
              }
            ].map((faq, i) => (
              <div class="fade-in" style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(180,120,160,0.12);">
                <h3 style="font-size: 0.975rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.625rem; display: flex; gap: 0.5rem;">
                  <span style="color: var(--pink-dark);">Q.</span>
                  {faq.q}
                </h3>
                <p style="font-size: 0.9rem; color: var(--text-sub); line-height: 1.7; padding-left: 1.5rem;">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
})

export default classes
