// ---- 장바구니 카운터 ----
let cartCount = 0;
const cartBadges = document.querySelectorAll(".cart-badge");

const updateCartBadge = () => {
  // 장바구니 배지 숫자와 표시 여부를 업데이트합니다.
  cartBadges.forEach((badge) => {
    if (cartCount > 0) {
      badge.textContent = cartCount;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  });
};

// ---- 장바구니 / CTA 버튼 토스트 알림 ----
const showToast = (message) => {
  // 토스트 메시지를 생성하고 화면에 표시합니다.
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("toast--visible");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2000);
};

// ---- Event 3 장바구니 버튼 (추가) ----
const event3CartBtn = document.querySelector(".btn-cart-icon");
if (event3CartBtn) {
  event3CartBtn.addEventListener("click", () => {
    cartCount++;
    updateCartBadge();
    showToast("장바구니에 담겼습니다 :)");
  });
}

// ---- Event 2 장바구니 버튼 ----
const event2CartButtons = document.querySelectorAll(".btn-cart-square");
event2CartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    cartCount++;
    updateCartBadge();
    showToast("장바구니에 담겼습니다 :)");
  });
});

// 헤더 상호작용: 메뉴 토글, 검색 포커스
const menuBtn = document.querySelector(".hd-header__menu");
const searchInput = document.querySelector(".search__input");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
    showToast(!expanded ? "메뉴가 열렸습니다." : "메뉴가 닫혔습니다.");
  });
}

if (searchInput) {
  searchInput.addEventListener("focus", () => {
    searchInput.closest(".search").classList.add("search--focus");
  });
  searchInput.addEventListener("blur", () => {
    searchInput.closest(".search").classList.remove("search--focus");
  });
}

// Breadcrumb toggle
const breadcrumbToggle = document.querySelector(".breadcrumb-toggle");
if (breadcrumbToggle) {
  breadcrumbToggle.addEventListener("click", () => {
    breadcrumbToggle.classList.toggle("is-active");
  });
}

// ---- Event 2 Page Slide ----
const event2Section = document.querySelector(
  '.event-section[aria-labelledby="event2-title"]'
);
if (event2Section) {
  const track = event2Section.querySelector(".event2-track");
  const dots = event2Section.querySelectorAll(".event2-indicator .dot");
  const barTracker = event2Section.querySelector(".scroll-tracker");
  const bar = barTracker
    ? barTracker.querySelector(".scroll-tracker__bar")
    : null;

  const goToPage = (index) => {
    // Event 2 슬라이더의 페이지를 이동시키고 인디케이터를 업데이트합니다.
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    // Update dots (Mobile)
    if (dots.length > 0) {
      dots.forEach((d, i) => {
        const isActive = i === index;
        d.classList.toggle("is-active", isActive);
        d.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    // Update bar (Desktop)
    if (bar) {
      // Assuming 2 pages max as per requirement
      // Page 0: 0%, Page 1: 50% (since bar width is 50%)
      bar.style.transform = `translateX(${index * 100}%)`;
    }
  };

  // Initialize Bar
  if (bar) {
    bar.style.width = "50%";
    bar.style.transition = "transform 0.4s ease";
    bar.style.backgroundColor = "#000";
  }

  // Dot Click Events
  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToPage(index));
    });
  }

  // Bar Click Events
  if (barTracker) {
    barTracker.addEventListener("click", (e) => {
      const rect = barTracker.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      // Left half -> Page 0, Right half -> Page 1
      if (clickX < width / 2) {
        goToPage(0);
      } else {
        goToPage(1);
      }
    });
  }
}

// Language toggle
const langBtn = document.querySelector(".topbar__lang");
if (langBtn) {
  langBtn.addEventListener("click", () => {
    langBtn.classList.toggle("is-active");
  });
}

// ---- Brand Carousel (Page-based Navigation) ----
(() => {
  const root = document.querySelector(".brand-carousel");
  if (!root) return;

  const viewport = root.querySelector(".brand-viewport");
  const track = root.querySelector(".brand-track");
  const prevBtn = root.querySelector(".btn-prev");
  const nextBtn = root.querySelector(".btn-next");
  const tracker = root.querySelector(".scroll-tracker");
  const bar = tracker ? tracker.querySelector(".scroll-tracker__bar") : null;
  if (!viewport || !track || !prevBtn || !nextBtn || !tracker || !bar) return;

  let index = 0; // 현재 페이지

  const getPageCount = () => {
    // 현재 뷰포트 너비를 기준으로 전체 페이지 수를 계산합니다.
    const vp = viewport.clientWidth || 0;
    if (!vp) return 0;
    // 트랙 전체 스크롤폭 기준으로 페이지 수 계산
    return Math.max(0, Math.ceil(track.scrollWidth / vp) - 1);
  };

  const updateBar = () => {
    // 스크롤 트래커 바의 너비와 위치를 업데이트합니다.
    const max = getPageCount();
    if (max <= 0) {
      bar.style.width = "100%";
      bar.style.transform = "translateX(0)";
      return;
    }

    // 바의 너비: 전체를 페이지 수로 나눈 비율
    const barWidthPercent = 100 / (max + 1);
    // 바의 위치: 현재 페이지 비율
    const barPositionPercent = (index / (max + 1)) * 100;

    bar.style.width = `${barWidthPercent}%`;
    bar.style.transform = `translateX(${index * 100}%)`;
  };

  const updateButtons = (max) => {
    // 이전/다음 버튼의 활성화 상태를 업데이트합니다.
    const atStart = index === 0;
    const atEnd = index === max;
    prevBtn.setAttribute("aria-disabled", String(atStart));
    nextBtn.setAttribute("aria-disabled", String(atEnd));
    prevBtn.style.color = atStart ? "#d6d8df" : "#1b1e23";
    nextBtn.style.color = atEnd ? "#d6d8df" : "#1b1e23";
  };

  const update = () => {
    // 캐러셀의 위치와 UI 상태를 전반적으로 업데이트합니다.
    const vp = viewport.clientWidth || 0;
    let max = getPageCount();
    if (index < 0) index = 0;
    if (index > max) index = max;

    track.style.transform = `translateX(-${index * vp}px)`;
    updateButtons(max);
    updateBar();
  };

  const go = (step) => {
    // 지정된 단계만큼 페이지를 이동합니다.
    index += step;
    update();
  };

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  const onResize = () => {
    // 창 크기 변경 시 캐러셀 상태를 재계산합니다.
    // index는 유지하되, 범위 벗어나면 보정
    const max = getPageCount();
    if (index > max) index = max;
    update();
  };
  window.addEventListener("resize", onResize, { passive: true });

  // 초기화
  update();
})();

// ---- Event 3 Product Gallery ----
(() => {
  const event3Section = document.querySelector(
    '.event-section[aria-labelledby="event3-title"]'
  );
  if (!event3Section) return;

  const mainImage = event3Section.querySelector(
    ".product-feature__thumb > img"
  );
  const dots = event3Section.querySelectorAll(
    ".product-feature__pagination .dot"
  );
  const thumbs = event3Section.querySelectorAll(".composition-thumb");

  // 이미지 경로 설정
  const imageUrls = [
    "public/images/products/event3/e3_sun.png",
    "public/images/products/event2/e2_neo.png",
  ];

  const setGalleryImage = (index) => {
    // 선택된 인덱스의 이미지로 갤러리를 업데이트합니다.
    if (!imageUrls[index]) return;

    // 메인 이미지 변경
    mainImage.src = imageUrls[index];

    // 도트 활성화 처리
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  // 도트 클릭 이벤트
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => setGalleryImage(index));
  });

  // 썸네일 클릭 이벤트
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setGalleryImage(index));
  });
})();

// ---- Fixed Header Padding Adjustment ----
const adjustBodyPadding = () => {
  // 헤더 높이에 맞춰 본문 상단 여백을 조정합니다.
  const header = document.querySelector(".site-header");
  if (header) {
    document.body.style.paddingTop = `${header.offsetHeight}px`;
  }
};

window.addEventListener("load", adjustBodyPadding);
window.addEventListener("resize", adjustBodyPadding);
