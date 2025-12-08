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
    showToast("선크림 세트가 장바구니에 담겼어요 😊");
  });
}

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    showToast("다른 기획전도 준비 중입니다.");
  });
}

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
  const bar = tracker.querySelector(".scroll-tracker__bar");

  if (container && bar) {
    const updateBar = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Width of the bar represents the visible portion
      const widthPercent = (clientWidth / scrollWidth) * 100;

      bar.style.width = `${widthPercent}%`;
      bar.style.left = `${(scrollLeft / scrollWidth) * 100}%`;
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
