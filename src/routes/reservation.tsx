import { Hono } from 'hono'
import { Layout } from '../renderer'
import type { Env } from '../lib/db'
import { createReservation, initDB } from '../lib/db'

const reservation = new Hono<{ Bindings: Env }>()

const CLASS_TYPES = [
  { value: 'clay', label: '🏺 클레이공예 (₩35,000~)' },
  { value: 'miniature', label: '🏠 미니어처 (₩45,000~)' },
  { value: 'decoden', label: '💎 데코덴 (₩40,000~)' },
  { value: 'uv-resin', label: '✨ UV레진 (₩38,000~)' },
  { value: 'kids-special', label: '🌈 키즈 스페셜 (₩30,000~)' },
  { value: 'private', label: '👑 프라이빗 클래스 (협의)' },
]

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
]

reservation.get('/', async (c) => {
  const success = c.req.query('success')
  const classType = c.req.query('class') || ''

  return c.html(
    <Layout title="예약하기 - 앤드메이드 AND MADE">
      {/* 페이지 헤더 */}
      <div class="page-header">
        <div class="hero-badge">📅 온라인 예약</div>
        <h1 class="page-header-title">수업 예약하기</h1>
        <p class="page-header-desc">
          원하는 날짜와 클래스를 선택하고<br />
          특별한 만들기 시간을 예약해보세요 ✨
        </p>
      </div>

      <section class="section">
        <div class="container">
          <div class="reservation-wrapper">
            {/* 예약 안내 정보 */}
            <div class="reservation-info">
              <h3>📋 예약 안내</h3>

              <div class="reservation-info-item">
                <span class="reservation-info-icon">📍</span>
                <div class="reservation-info-text">
                  <h4>위치</h4>
                  <p>서울 광진구 장안동<br />(네이버: 앤드메이드 검색)</p>
                </div>
              </div>

              <div class="reservation-info-item">
                <span class="reservation-info-icon">🕐</span>
                <div class="reservation-info-text">
                  <h4>운영 시간</h4>
                  <p>화~일 11:00 - 19:00<br />월요일 정기 휴무</p>
                </div>
              </div>

              <div class="reservation-info-item">
                <span class="reservation-info-icon">💬</span>
                <div class="reservation-info-text">
                  <h4>카카오톡 문의</h4>
                  <p>앤드메이드<br />(ID: andmade)</p>
                </div>
              </div>

              <div class="reservation-info-item">
                <span class="reservation-info-icon">⚠️</span>
                <div class="reservation-info-text">
                  <h4>예약 확인 안내</h4>
                  <p>예약 접수 후 24시간 내<br />카카오톡으로 확인 연락드립니다.</p>
                </div>
              </div>

              <div class="reservation-info-item">
                <span class="reservation-info-icon">🔄</span>
                <div class="reservation-info-text">
                  <h4>취소/환불 정책</h4>
                  <p>24시간 전: 전액 환불<br />12시간 전: 50% 환불<br />당일: 환불 불가</p>
                </div>
              </div>

              <div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 1.25rem; margin-top: 0.5rem;">
                <p style="font-size: 0.85rem; opacity: 0.9; line-height: 1.7;">
                  💡 예약 후 카카오채널로<br />
                  추가 문의가 가능합니다!
                </p>
              </div>
            </div>

            {/* 예약 폼 */}
            <div class="form-card">
              {success === '1' ? (
                <div id="reservation-success" style="text-align: center; padding: 3rem 1rem;">
                  <div style="font-size: 4rem; margin-bottom: 1.5rem;">🎉</div>
                  <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">예약이 접수되었습니다!</h2>
                  <p style="color: var(--text-sub); line-height: 1.8; margin-bottom: 2rem;">
                    24시간 이내에 카카오톡으로<br />
                    예약 확인 연락을 드리겠습니다. 🌸
                  </p>
                  <a href="/" class="btn-primary" style="display: inline-flex;">
                    <i class="fas fa-home"></i>
                    홈으로 돌아가기
                  </a>
                </div>
              ) : (
                <form id="reservation-form">
                  <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.375rem;">예약 신청</h2>
                  <p style="font-size: 0.875rem; color: var(--text-sub); margin-bottom: 2rem;">
                    아래 정보를 입력해 주세요.
                    <span style="color: var(--pink-dark);">*</span> 표시는 필수 항목입니다.
                  </p>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">
                        이름 <span class="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        class="form-control"
                        placeholder="홍길동"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">
                        연락처 <span class="required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        class="form-control"
                        placeholder="010-0000-0000"
                        pattern="[0-9\-]+"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">이메일</label>
                    <input
                      type="email"
                      name="email"
                      class="form-control"
                      placeholder="example@email.com (선택사항)"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      클래스 종류 <span class="required">*</span>
                    </label>
                    <select name="class_type" class="form-control" required>
                      <option value="">클래스를 선택해주세요</option>
                      {CLASS_TYPES.map((ct) => (
                        <option value={ct.value} selected={classType === ct.value}>
                          {ct.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">
                        희망 날짜 <span class="required">*</span>
                      </label>
                      <input
                        type="date"
                        name="class_date"
                        class="form-control"
                        required
                      />
                      <p class="form-hint">월요일은 휴무입니다</p>
                    </div>
                    <div class="form-group">
                      <label class="form-label">
                        희망 시간 <span class="required">*</span>
                      </label>
                      <select name="class_time" class="form-control" required>
                        <option value="">시간 선택</option>
                        {TIME_SLOTS.map((slot) => (
                          <option value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      참여 인원 <span class="required">*</span>
                    </label>
                    <select name="participants" class="form-control" required>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option value={n}>{n}명</option>
                      ))}
                    </select>
                    <p class="form-hint">8인 이상은 카카오채널로 문의해 주세요</p>
                  </div>

                  <div class="form-group">
                    <label class="form-label">요청사항 / 메시지</label>
                    <textarea
                      name="message"
                      class="form-control"
                      rows={4}
                      placeholder="특별 요청사항이 있으시면 입력해 주세요. (나이, 알러지 여부, 테마 등)"
                      style="resize: vertical;"
                    ></textarea>
                  </div>

                  <div style="background: var(--pink-light); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.75rem; font-size: 0.85rem; color: var(--text-sub); line-height: 1.7;">
                    📌 예약 접수 후 관리자 확인 후 카카오톡으로 최종 확인 연락을 드립니다.<br />
                    입금 안내는 확인 메시지와 함께 전달됩니다.
                  </div>

                  <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; font-size: 1.05rem; padding: 1rem;">
                    <i class="fas fa-calendar-check"></i>
                    예약 접수하기
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 카카오채널 CTA */}
      <section class="section section-alt">
        <div class="container" style="max-width: 680px; text-align: center;">
          <div class="fade-in">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
            <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem;">빠른 문의는 카카오채널로!</h2>
            <p style="font-size: 0.95rem; color: var(--text-sub); margin-bottom: 2rem; line-height: 1.8;">
              수업 관련 궁금한 점이나 단체 예약 문의는<br />
              카카오채널 앤드메이드로 연락해 주세요 😊
            </p>
            <a
              href="https://pf.kakao.com/_andmade"
              target="_blank"
              style="display: inline-flex; align-items: center; gap: 0.625rem; background: #FEE500; color: #3C1E1E; padding: 0.875rem 2.25rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 16px rgba(254,229,0,0.5);"
            >
              <i class="fas fa-comment"></i>
              카카오채널 @앤드메이드
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
})

export default reservation
