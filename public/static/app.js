/* ============================================
   앤드메이드 메인 JavaScript
   ============================================ */

// ===== 네비게이션 모바일 메뉴 =====
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('navbar-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('open')
          ? 'fas fa-times'
          : 'fas fa-bars';
      }
    });

    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = menuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // 현재 페이지 활성 메뉴 표시
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // 페이드인 애니메이션 (Intersection Observer)
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeElements.forEach(el => observer.observe(el));

  // 예약 폼 초기화
  initReservationForm();

  // 관리자 폼 초기화
  initAdminForms();
});

// ===== 토스트 알림 =====
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== 예약 폼 처리 =====
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  // 날짜 최소값 설정 (오늘 이후)
  const dateInput = form.querySelector('input[name="class_date"]');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate() + 1).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> 예약 접수 중...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('예약이 접수되었습니다! 확인 후 연락드리겠습니다 🎉');
        form.reset();
        
        // 성공 메시지 표시
        const successDiv = document.getElementById('reservation-success');
        if (successDiv) {
          successDiv.style.display = 'block';
          successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        showToast(result.message || '예약 처리 중 오류가 발생했습니다.', 'error');
      }
    } catch (err) {
      showToast('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===== 관리자 폼 처리 =====
function initAdminForms() {
  // 예약 상태 변경
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const status = btn.dataset.status;

      if (action === 'update-reservation-status') {
        await updateReservationStatus(id, status, btn);
      } else if (action === 'delete-reservation') {
        if (confirm('예약을 삭제하시겠습니까?')) {
          await deleteReservation(id, btn);
        }
      } else if (action === 'delete-post') {
        if (confirm('게시글을 삭제하시겠습니까?')) {
          await deletePost(id, btn);
        }
      } else if (action === 'delete-gallery') {
        if (confirm('갤러리 항목을 삭제하시겠습니까?')) {
          await deleteGallery(id, btn);
        }
      } else if (action === 'delete-video') {
        if (confirm('영상을 삭제하시겠습니까?')) {
          await deleteVideo(id, btn);
        }
      }
    });
  });

  // 게시글 폼
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(postForm);
      const data = Object.fromEntries(formData);
      const id = data.id;
      const url = id ? `/api/admin/posts/${id}` : '/api/admin/posts';
      const method = id ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          showToast('게시글이 저장되었습니다!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast(result.message || '오류가 발생했습니다.', 'error');
        }
      } catch (err) {
        showToast('오류가 발생했습니다.', 'error');
      }
    });
  }

  // 유튜브 영상 등록 폼
  const videoForm = document.getElementById('video-form');
  if (videoForm) {
    videoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(videoForm);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch('/api/admin/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          showToast('영상이 등록되었습니다!');
          videoForm.reset();
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast(result.message || '오류가 발생했습니다.', 'error');
        }
      } catch (err) {
        showToast('오류가 발생했습니다.', 'error');
      }
    });
  }
}

// ===== API 함수들 =====
async function updateReservationStatus(id, status, btn) {
  const originalText = btn.innerHTML;
  btn.disabled = true;
  try {
    const res = await fetch(`/api/admin/reservations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (result.success) {
      showToast('예약 상태가 업데이트되었습니다!');
      setTimeout(() => window.location.reload(), 800);
    } else {
      showToast('오류가 발생했습니다.', 'error');
    }
  } catch {
    showToast('오류가 발생했습니다.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function deleteReservation(id, btn) {
  const row = btn.closest('tr');
  try {
    const res = await fetch(`/api/admin/reservations/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast('예약이 삭제되었습니다.');
      if (row) row.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => row && row.remove(), 300);
    } else {
      showToast('오류가 발생했습니다.', 'error');
    }
  } catch {
    showToast('오류가 발생했습니다.', 'error');
  }
}

async function deletePost(id, btn) {
  const row = btn.closest('tr') || btn.closest('.admin-card');
  try {
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast('게시글이 삭제되었습니다.');
      setTimeout(() => window.location.reload(), 800);
    } else {
      showToast('오류가 발생했습니다.', 'error');
    }
  } catch {
    showToast('오류가 발생했습니다.', 'error');
  }
}

async function deleteGallery(id, btn) {
  try {
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast('항목이 삭제되었습니다.');
      setTimeout(() => window.location.reload(), 800);
    } else {
      showToast('오류가 발생했습니다.', 'error');
    }
  } catch {
    showToast('오류가 발생했습니다.', 'error');
  }
}

async function deleteVideo(id, btn) {
  try {
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      showToast('영상이 삭제되었습니다.');
      setTimeout(() => window.location.reload(), 800);
    } else {
      showToast('오류가 발생했습니다.', 'error');
    }
  } catch {
    showToast('오류가 발생했습니다.', 'error');
  }
}

// ===== 갤러리 이미지 업로드 미리보기 =====
function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview || !input.files || !input.files[0]) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(input.files[0]);
}

// ===== 유튜브 Video ID 추출 =====
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// 유튜브 URL 입력 시 자동으로 Video ID 추출
const videoUrlInput = document.getElementById('video-url-input');
const videoIdInput = document.getElementById('video-id-input');
if (videoUrlInput && videoIdInput) {
  videoUrlInput.addEventListener('input', () => {
    const id = extractVideoId(videoUrlInput.value.trim());
    if (id) {
      videoIdInput.value = id;
    }
  });
}
