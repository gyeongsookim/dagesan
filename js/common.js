/**
 * 다계산 Common JavaScript
 * 네비게이션, 모바일 메뉴, 알림 토스트, 클립보드 복사, 입력 포맷팅
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 모바일 메뉴 토글
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. 현재 활성 메뉴 하이라이트
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-blue-600', 'font-bold');
      link.classList.remove('text-slate-600');
    }
  });

  // 3. 메인 검색 기능 (index.html 전용)
  const toolSearchInput = document.getElementById('toolSearchInput');
  if (toolSearchInput) {
    toolSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const toolCards = document.querySelectorAll('.tool-card');
      let foundAny = false;

      toolCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        const keywords = card.getAttribute('data-keywords') || '';
        const fullText = (title + ' ' + keywords + ' ' + card.innerText).toLowerCase();

        if (fullText.includes(query)) {
          card.style.display = 'flex';
          foundAny = true;
        } else {
          card.style.display = 'none';
        }
      });

      const noResults = document.getElementById('noResultsMessage');
      if (noResults) {
        noResults.style.display = foundAny ? 'none' : 'block';
      }
    });
  }

  // 4. 아코디언 FAQ 토글
  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector('.faq-icon');
      
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });
});

/**
 * 토스트 알림창 표시
 * @param {string} message 
 */
function showToast(message) {
  let toast = document.getElementById('allcalc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'allcalc-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span class="text-sm font-medium">${message}</span>
  `;

  // 표시
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  // 2.5초 후 자동 숨김
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

/**
 * 텍스트 클립보드 복사
 * @param {string} text 
 * @param {string} successMessage 
 */
function copyToClipboard(text, successMessage = '클립보드에 복사되었습니다.') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    alert('복사에 실패했습니다. 직접 복사해 주세요.');
  }
  document.body.removeChild(textArea);
}

/**
 * 숫자 인풋 1,000 단위 콤마 자동 서식 설정
 * @param {HTMLInputElement} inputElement 
 * @param {Function} onChangeCallback 
 */
function attachNumberFormatter(inputElement, onChangeCallback) {
  if (!inputElement) return;

  inputElement.addEventListener('input', (e) => {
    let cursorPosition = e.target.selectionStart;
    let rawValue = e.target.value.replace(/[^0-9]/g, '');

    if (!rawValue) {
      e.target.value = '';
      if (onChangeCallback) onChangeCallback(0);
      return;
    }

    const formatted = parseInt(rawValue, 10).toLocaleString('ko-KR');
    e.target.value = formatted;

    if (onChangeCallback) {
      onChangeCallback(parseInt(rawValue, 10));
    }
  });
}
