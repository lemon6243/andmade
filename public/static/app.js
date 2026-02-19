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
      if (icon) icon.className = navMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = menuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // 현재 페이지 활성 메뉴
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
  });

  // 페이드인 애니메이션
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  initReservationForm();
  initAdminForms();
});

// ===== 토스트 알림 =====
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ===== 예약 폼 =====
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

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
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        showToast('예약이 접수되었습니다! 확인 후 연락드리겠습니다 🎉');
        form.reset();
        const successDiv = document.getElementById('reservation-success');
        if (successDiv) { successDiv.style.display = 'block'; successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
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

// ===== 관리자 폼 =====
function initAdminForms() {
  // 데이터 액션 버튼
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const status = btn.dataset.status;

      if (action === 'update-reservation-status') {
        await updateReservationStatus(id, status, btn);
      } else if (action === 'delete-reservation') {
        if (confirm('예약을 삭제하시겠습니까?')) await deleteItem('reservation', id, btn);
      } else if (action === 'delete-post') {
        if (confirm('게시글을 삭제하시겠습니까?')) await deleteItem('post', id, btn);
      } else if (action === 'delete-gallery') {
        if (confirm('갤러리 항목을 삭제하시겠습니까?')) await deleteItem('gallery', id, btn);
      } else if (action === 'delete-video') {
        if (confirm('영상을 삭제하시겠습니까?')) await deleteItem('video', id, btn);
      } else if (action === 'toggle-post-published') {
        const currentPublished = parseInt(btn.dataset.published || '1');
        const newPublished = currentPublished === 1 ? 0 : 1;
        await togglePostPublished(id, newPublished, btn);
      }
    });
  });

  // 게시글 폼 (작성/수정 통합)
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const editId = postForm.dataset.editId;
      const title = document.getElementById('post-title')?.value?.trim();
      const content = document.getElementById('post-content')?.value?.trim();
      const category = document.getElementById('post-category')?.value;
      const published = parseInt(document.getElementById('post-published')?.value || '1');

      if (!title || !content) { showToast('제목과 내용을 입력해주세요.', 'error'); return; }

      const url = editId ? `/api/admin/posts/${editId}` : '/api/admin/posts';
      const method = editId ? 'PUT' : 'POST';

      const submitBtn = postForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> 저장 중...';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, category, published })
        });
        const result = await res.json();
        if (result.success) {
          showToast(editId ? '게시글이 수정되었습니다!' : '게시글이 등록되었습니다!');
          setTimeout(() => window.location.href = '/admin/posts', 1000);
        } else {
          showToast(result.message || '오류가 발생했습니다.', 'error');
        }
      } catch (err) {
        showToast('오류가 발생했습니다.', 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 유튜브 영상 등록 폼
  const videoForm = document.getElementById('video-form');
  if (videoForm) {
    videoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(videoForm));
      const submitBtn = videoForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> 등록 중...';
      try {
        const res = await fetch('/api/admin/videos', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
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
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 유튜브 URL → Video ID 자동 추출
  const videoUrlInput = document.getElementById('video-url-input');
  const videoIdInput = document.getElementById('video-id-input');
  if (videoUrlInput && videoIdInput) {
    videoUrlInput.addEventListener('input', () => {
      const id = extractVideoId(videoUrlInput.value.trim());
      if (id) videoIdInput.value = id;
    });
  }
}

// ===== API 함수들 =====
async function updateReservationStatus(id, status, btn) {
  const originalText = btn.innerHTML;
  btn.disabled = true;
  try {
    const res = await fetch(`/api/admin/reservations/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (result.success) { showToast('예약 상태가 업데이트되었습니다!'); setTimeout(() => window.location.reload(), 800); }
    else showToast('오류가 발생했습니다.', 'error');
  } catch { showToast('오류가 발생했습니다.', 'error'); }
  finally { btn.innerHTML = originalText; btn.disabled = false; }
}

async function deleteItem(type, id, btn) {
  const urlMap = {
    reservation: `/api/admin/reservations/${id}`,
    post: `/api/admin/posts/${id}`,
    gallery: `/api/admin/gallery/${id}`,
    video: `/api/admin/videos/${id}`
  };
  const msgMap = {
    reservation: '예약이 삭제되었습니다.',
    post: '게시글이 삭제되었습니다.',
    gallery: '갤러리 항목이 삭제되었습니다.',
    video: '영상이 삭제되었습니다.'
  };
  btn.disabled = true;
  try {
    const res = await fetch(urlMap[type], { method: 'DELETE' });
    const result = await res.json();
    if (result.success) { showToast(msgMap[type] || '삭제되었습니다.'); setTimeout(() => window.location.reload(), 800); }
    else showToast('오류가 발생했습니다.', 'error');
  } catch { showToast('오류가 발생했습니다.', 'error'); }
  finally { btn.disabled = false; }
}

async function togglePostPublished(id, newPublished, btn) {
  btn.disabled = true;
  try {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: newPublished })
    });
    const result = await res.json();
    if (result.success) {
      showToast(newPublished === 1 ? '게시 상태로 변경되었습니다.' : '비게시 상태로 변경되었습니다.');
      setTimeout(() => window.location.reload(), 800);
    } else showToast('오류가 발생했습니다.', 'error');
  } catch { showToast('오류가 발생했습니다.', 'error'); }
  finally { btn.disabled = false; }
}

// ===== 유튜브 Video ID 추출 =====
function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
