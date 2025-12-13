/* ==================================================
  CART + TOAST (Micro Interaction)
================================================== */
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

const bindCartButtons = () => {
  const event3CartBtn = document.querySelector(".btn-cart-icon");
  if (event3CartBtn) {
    event3CartBtn.addEventListener("click", () => {
      cartCount++;
      updateCartBadge();
      showToast("장바구니에 담겼습니다 :)");
    });
  }

  const event2CartButtons = document.querySelectorAll(".btn-cart-square");
  event2CartButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      cartCount++;
      updateCartBadge();
      showToast("장바구니에 담겼습니다 :)");
    });
  });
};

bindCartButtons();

/* ==================================================
  HEADER INTERACTION (Menu Layer, Search Focus)
================================================== */
const menuBtn = document.querySelector(".hd-header__menu");
const menuLayer = document.querySelector("#menu-layer");
const searchInput = document.querySelector(".search__input");

const openMenuLayer = () => {
  if (!menuLayer || !menuBtn) return;
  menuLayer.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("nav-open");
};

const closeMenuLayer = () => {
  if (!menuLayer || !menuBtn) return;
  menuLayer.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

if (menuBtn && menuLayer) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenuLayer();
    else openMenuLayer();
  });

  document.addEventListener("click", (e) => {
    if (menuLayer.hidden) return;
    const target = e.target;
    const clickedInside = menuLayer.contains(target) || menuBtn.contains(target);
    if (!clickedInside) closeMenuLayer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menuLayer.hidden) closeMenuLayer();
  });
}

if (searchInput) {
  searchInput.addEventListener("focus", () => {
    searchInput.closest(".search")?.classList.add("search--focus");
  });
  searchInput.addEventListener("blur", () => {
    searchInput.closest(".search")?.classList.remove("search--focus");
  });
}

const langBtn = document.querySelector(".topbar__lang");
if (langBtn) {
  langBtn.addEventListener("click", () => {
    langBtn.classList.toggle("is-active");
  });
}

/* ==================================================
  BREADCRUMB TOGGLE (Micro Motion)
================================================== */
const breadcrumbToggle = document.querySelector(".breadcrumb-toggle");
if (breadcrumbToggle) {
  breadcrumbToggle.addEventListener("click", () => {
    breadcrumbToggle.classList.toggle("is-active");
  });
}

/* ==================================================
  TABS / PANELS (a11y + structure)
================================================== */
(() => {
  const tabs = document.querySelectorAll(".hero-tabs__btn[role='tab']");
  const panels = [
    document.getElementById("panel-event"),
    document.getElementById("panel-recommend"),
    document.getElementById("panel-all"),
  ].filter(Boolean);

  if (!tabs.length || !panels.length) return;

  const activate = (targetId, moveFocus = false) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.target === targetId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && moveFocus) tab.focus();
    });

    panels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("panel--active", isActive);
      panel.hidden = !isActive;
    });

    if (menuLayer && menuBtn && !menuLayer.hidden) closeMenuLayer();
  };

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => activate(tab.dataset.target, false));

    tab.addEventListener("keydown", (e) => {
      const key = e.key;
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;

      e.preventDefault();
      let nextIndex = idx;

      if (key === "ArrowLeft") nextIndex = (idx - 1 + tabs.length) % tabs.length;
      if (key === "ArrowRight") nextIndex = (idx + 1) % tabs.length;
      if (key === "Home") nextIndex = 0;
      if (key === "End") nextIndex = tabs.length - 1;

      const nextTab = tabs[nextIndex];
      activate(nextTab.dataset.target, true);
    });
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    activate(btn.getAttribute("data-go"), true);
  });

  const initial = document.querySelector(".hero-tabs__btn.is-active")?.dataset.target || "panel-event";
  activate(initial, false);
})();

/* ==================================================
  EVENT 2 SLIDER (Dots + Bar)
================================================== */
(() => {
  const event2Section = document.querySelector('.event-section[aria-labelledby="event2-title"]');
  if (!event2Section) return;

  const track = event2Section.querySelector(".event2-track");
  const dots = event2Section.querySelectorAll(".event2-indicator .dot");
  const barTracker = event2Section.querySelector(".scroll-tracker__bar_event2");
  const bar = barTracker ? barTracker.querySelector(".scroll-tracker__bar") : null;

  const goToPage = (index) => {
    if (track) track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d, i) => {
      const isActive = i === index;
      d.classList.toggle("is-active", isActive);
      d.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (bar) bar.style.transform = `translateX(${index * 100}%)`;
  };

  if (bar) {
    bar.style.width = "50%";
    bar.style.transition = "transform 0.4s ease";
    bar.style.backgroundColor = "#000";
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToPage(index));
  });

  if (barTracker) {
    barTracker.addEventListener("click", (e) => {
      const rect = barTracker.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      if (clickX < width / 2) goToPage(0);
      else goToPage(1);
    });
  }
})();

/* ==================================================
  BRAND CAROUSEL (Page-based)
================================================== */
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

  let pageIndex = 0;

  const getVisibleCards = () => {
    return Array.from(track.querySelectorAll(".brand-card")).filter((el) => {
      return getComputedStyle(el).display !== "none";
    });
  };

  const getGapPx = () => {
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap || style.columnGap || "0");
    return Number.isFinite(gap) ? gap : 0;
  };

  const getMetrics = () => {
    const cards = getVisibleCards();
    const total = cards.length;
    const vp = viewport.clientWidth || 0;
    if (!total || !vp) {
      return { total, vp, cardW: 0, gap: 0, perPage: 1, pages: 1 };
    }

    const gap = getGapPx();
    const cardW = cards[0].getBoundingClientRect().width || 0;

    const perPage = Math.max(1, Math.floor((vp + gap) / (cardW + gap)));
    const pages = Math.max(1, Math.ceil(total / perPage));

    return { total, vp, cardW, gap, perPage, pages };
  };

  const updateUI = () => {
    const { total, cardW, gap, perPage, pages } = getMetrics();

    pageIndex = Math.min(pageIndex, pages - 1);
    pageIndex = Math.max(pageIndex, 0);

    const maxStart = Math.max(0, total - perPage);
    let startIndex = pageIndex * perPage;
    if (startIndex > maxStart) startIndex = maxStart;

    const step = cardW + gap;
    const translateX = startIndex * step;

    track.style.transform = `translateX(-${translateX}px)`;

    const atStart = pageIndex === 0;
    const atEnd = pageIndex === pages - 1;

    prevBtn.setAttribute("aria-disabled", String(atStart));
    nextBtn.setAttribute("aria-disabled", String(atEnd));

    track.classList.toggle("is-center", pages <= 1);

    if (pages <= 1) {
      bar.style.width = "100%";
      bar.style.transform = "translateX(0)";
    } else {
      const w = 100 / pages;
      bar.style.width = `${w}%`;
      bar.style.transform = `translateX(${pageIndex * 100}%)`;
    }
  };

  const go = (delta) => {
    pageIndex += delta;
    updateUI();
  };

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  tracker.addEventListener("click", (e) => {
    const rect = tracker.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) go(-1);
    else go(1);
  });

  window.addEventListener("resize", updateUI, { passive: true });

  updateUI();
})();

/* ==================================================
  EVENT 3 GALLERY (Dots + Thumbs)
================================================== */
(() => {
  const event3Section = document.querySelector('.event-section[aria-labelledby="event3-title"]');
  if (!event3Section) return;

  const mainImage = event3Section.querySelector(".product-feature__thumb > img");
  const dots = event3Section.querySelectorAll(".product-feature__pagination .dot");
  const thumbs = event3Section.querySelectorAll(".composition-thumb");

  const imageUrls = [
    "public/images/products/event3/e3_sun.png",
    "public/images/products/event2/e2_neo.png",
  ];

  const setGalleryImage = (index) => {
    if (!imageUrls[index] || !mainImage) return;
    mainImage.src = imageUrls[index];

    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  dots.forEach((dot, index) => dot.addEventListener("click", () => setGalleryImage(index)));
  thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => setGalleryImage(index)));
})();

/* ==================================================
  FIXED HEADER PADDING (Layout 안정화)
================================================== */
const adjustBodyPadding = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  document.body.style.paddingTop = `${header.offsetHeight}px`;
  document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
};

window.addEventListener("load", adjustBodyPadding);
window.addEventListener("resize", adjustBodyPadding);
