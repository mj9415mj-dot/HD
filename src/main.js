// ---- 장바구니 카운터 ----
let cartCount = 0;
const cartBadges = document.querySelectorAll(".cart-badge");

const updateCartBadge = () => {
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
const featureCartBtn = document.querySelector(".product-feature .btn-primary");
const ctaBtn = document.querySelector(".cta__button");

const showToast = (message) => {
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

if (featureCartBtn) {
  featureCartBtn.addEventListener("click", () => {
    cartCount++;
    updateCartBadge();
    showToast("선크림 세트가 장바구니에 담겼어요 😊");
  });
}

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    showToast("다른 기획전도 준비 중입니다.");
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

// ---- Scroll Progress Tracker ----
const trackers = document.querySelectorAll(".scroll-tracker");

trackers.forEach((tracker) => {
  // Find the scroll container within the same parent wrapper
  // Priority: .product-slider-wrapper (Event 2) > ul (Event 1)
  const container =
    tracker.parentElement.querySelector(".product-slider-wrapper") ||
    tracker.parentElement.querySelector("ul");

  if (container) {
    const updateBar = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Width of the bar represents the visible portion
      const widthPercent = (clientWidth / scrollWidth) * 100;
    };

    // Initial update
    requestAnimationFrame(updateBar);

    // Update on scroll
    container.addEventListener("scroll", () => {
      requestAnimationFrame(updateBar);
    });

    // Update on resize
    window.addEventListener("resize", updateBar);

    // Also update when images load
    container.querySelectorAll("img").forEach((img) => {
      img.addEventListener("load", updateBar);
    });
  }
});

// ---- Slider Pagination (Event 2 Mobile) ----
const sliderPagination = document.querySelector(".slider-pagination");
if (sliderPagination) {
  // Find the slider wrapper in the same section
  const section = sliderPagination.closest(".event-section");
  const container = section
    ? section.querySelector(".product-slider-wrapper")
    : null;
  const dots = sliderPagination.querySelectorAll(".dot");

  if (container && dots.length > 0) {
    const updateDots = () => {
      const { scrollLeft, clientWidth } = container;
      // Calculate current page index (0 or 1)
      const index = Math.round(scrollLeft / clientWidth);

      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    };

    container.addEventListener("scroll", () => {
      requestAnimationFrame(updateDots);
    });

    // Click on dot to scroll
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        container.scrollTo({
          left: i * container.clientWidth,
          behavior: "smooth",
        });
      });
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
    const vp = viewport.clientWidth || 0;
    if (!vp) return 0;
    // 트랙 전체 스크롤폭 기준으로 페이지 수 계산
    return Math.max(0, Math.ceil(track.scrollWidth / vp) - 1);
  };

  const updateBar = () => {
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
    const atStart = index === 0;
    const atEnd = index === max;
    prevBtn.setAttribute("aria-disabled", String(atStart));
    nextBtn.setAttribute("aria-disabled", String(atEnd));
    prevBtn.style.color = atStart ? "#d6d8df" : "#1b1e23";
    nextBtn.style.color = atEnd ? "#d6d8df" : "#1b1e23";
  };

  const update = () => {
    const vp = viewport.clientWidth || 0;
    let max = getPageCount();
    if (index < 0) index = 0;
    if (index > max) index = max;

    track.style.transform = `translateX(-${index * vp}px)`;
    updateButtons(max);
    updateBar();
  };

  const go = (step) => {
    index += step;
    update();
  };

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  const onResize = () => {
    // index는 유지하되, 범위 벗어나면 보정
    const max = getPageCount();
    if (index > max) index = max;
    update();
  };
  window.addEventListener("resize", onResize, { passive: true });

  // 초기화
  update();
})();
