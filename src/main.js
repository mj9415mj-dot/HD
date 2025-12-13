import VARIANTS from './data.js';

// 1. Determine Variant
const urlParams = new URLSearchParams(window.location.search);
const variantKey = urlParams.get('v') || 'a'; // Default to 'a'
const data = VARIANTS[variantKey] || VARIANTS['a'];

// Apply variant specific styles
if (variantKey === 'b') {
  document.documentElement.style.setProperty('--color-hero-bg', '#D6CEEB');
  document.documentElement.style.setProperty('--color-hero-bg-title', '#7F519C');
}

// 2. Render Functions
const renderHero = (heroData) => {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  heroSection.innerHTML = `
    <div class="container hero-container_box">
      <div class="hero__text">
        <p class="hero__date">${heroData.date}</p>
        <h2 class="hero__title">${heroData.title}</h2>
        <p class="hero__subtitle">${heroData.subtitle}</p>
      </div>
      <div class="hero__image">
        <img src="${heroData.image}" alt="${heroData.alt}" />
      </div>
    </div>
  `;
};

const renderBrandCarousel = (eventData) => {
  const items = eventData.data.map(brand => `
    <li class="brand-card ${brand.className || ''}">
      <a href="#">
        <div class="brand-card__thumb">
          <div class="brand-card__overlay">
            <img class="brand-card__logo" src="${brand.logo}" alt="${brand.name}" />
            <span class="brand-card__shop-label">BRAND SHOP</span>
          </div>
          <img class="brand-card__bg" src="${brand.bg}" alt="" aria-hidden="true" />
        </div>
      </a>
      <span class="brand-card__name">${brand.name}</span>
    </li>
  `).join('');

  return `
    <section class="event-section" aria-labelledby="event1-title">
      <header class="section-head section-head--center">
        <p class="section-head__eyebrow">${eventData.badge}</p>
        <h3 id="event1-title" class="section-head__title">${eventData.title}</h3>
        <p class="section-head__desc">${eventData.desc}</p>
      </header>

      <div class="brand-carousel">
        <button class="brand-carousel__control brand-carousel__control--prev btn-prev" type="button" aria-label="이전 브랜드 보기" aria-disabled="true">
          <img src="public/svg/icon-arrow.svg" alt="" aria-hidden="true" />
        </button>

        <div class="brand-viewport">
          <ul class="brand-carousel__list brand-track">
            ${items}
          </ul>
        </div>

        <button class="brand-carousel__control brand-carousel__control--next btn-next" type="button" aria-label="다음 브랜드 보기" aria-disabled="false">
          <img src="public/svg/icon-arrow.svg" alt="" aria-hidden="true" />
        </button>

        <div class="scroll-tracker" aria-hidden="true">
          <div class="scroll-tracker__bar"></div>
        </div>
      </div>
    </section>
  `;
};

const renderProductGrid = (eventData) => {
  // Split data into chunks of 6 for pages
  const chunkSize = 6;
  const pages = [];
  for (let i = 0; i < eventData.data.length; i += chunkSize) {
    pages.push(eventData.data.slice(i, i + chunkSize));
  }

  const pagesHtml = pages.map(page => `
    <ul class="product-grid-page event2-page">
      ${page.map(product => `
        <li class="product-card">
          <div class="product-card__img-box">
            <a href="#">
              <img src="${product.img}" alt="${product.name}" />
            </a>
            <button type="button" class="btn-cart-square" aria-label="장바구니 담기"></button>
          </div>
          <div class="product-card__info">
            <a href="#">
              <p class="product-card__name">${product.name}</p>
              <div class="product-card__price-row">
                <span class="rate">${product.rate}</span>
                <span class="current">${product.current}</span>
                <span class="original">${product.original}</span>
              </div>
            </a>
          </div>
        </li>
      `).join('')}
    </ul>
  `).join('');

  const dotsHtml = pages.map((_, i) => `
    <button class="dot ${i === 0 ? 'is-active' : ''}" type="button" aria-label="${i + 1}페이지" aria-current="${i === 0}"></button>
  `).join('');

  return `
    <section class="event-section" aria-labelledby="event2-title">
      <header class="section-head section-head--center">
        <p class="section-head__eyebrow">${eventData.badge}</p>
        <h3 id="event2-title" class="section-head__title">${eventData.title}</h3>
        <p class="section-head__desc">${eventData.desc}</p>
      </header>

      <div class="product-slider-wrapper">
        <div class="event2-track">
          ${pagesHtml}
        </div>
      </div>

      <div class="scroll-tracker scroll-tracker__bar_event2" aria-hidden="true">
        <div class="scroll-tracker__bar"></div>
      </div>

      <div class="event2-indicator">
        ${dotsHtml}
      </div>
    </section>
  `;
};

const renderProductFeature = (eventData) => {
  const maxVisibleThumbs = 4;
  const totalItems = eventData.composition.length;
  const remainingCount = 9;

  const compositionThumbs = eventData.composition.map((item, i) => {
    // Logic for the 4th item (index 3) when there are more items
    if (i === maxVisibleThumbs - 1 && remainingCount > 0) {
      return `
        <button type="button" class="composition-thumb more-thumb" aria-label="더보기" data-remaining="+${remainingCount}">
          <div class="thumb-overlay">
            <span class="more-count">+${remainingCount}</span>
          </div>
          <img src="${item.src}" alt="${item.alt}" />
        </button>
      `;
    }
    
    // Logic for items beyond the 4th (initially hidden)
    if (i >= maxVisibleThumbs) {
      return `
        <button type="button" class="composition-thumb is-hidden" aria-label="구성품 ${i + 1}" style="display: none;">
          <img src="${item.src}" alt="${item.alt}" />
        </button>
      `;
    }

    // Normal items (1st, 2nd, 3rd)
    return `
      <button type="button" class="composition-thumb" aria-label="구성품 ${i + 1}">
        <img src="${item.src}" alt="${item.alt}" />
      </button>
    `;
  }).join('');

  const dots = eventData.composition.map((_, i) => `
    <button type="button" class="dot ${i === 0 ? 'is-active' : ''}" aria-label="${i + 1}번 이미지"></button>
  `).join('');

  const descHtml = eventData.descMobile && eventData.descMobile !== eventData.desc
    ? `<p class="section-head__desc is-desktop-only">${eventData.desc}</p>
       <p class="section-head__desc is-mobile-only">${eventData.descMobile}</p>`
    : `<p class="section-head__desc">${eventData.desc}</p>`;

  return `
    <section class="event-section" aria-labelledby="event3-title-${eventData.badge}">
      <header class="section-head section-head--center">
        <p class="section-head__eyebrow">${eventData.badge}</p>
        <h3 id="event3-title-${eventData.badge}" class="section-head__title">${eventData.title}</h3>
        ${descHtml}
      </header>

      <article class="product-feature" data-images='${JSON.stringify(eventData.composition.map(c => c.src))}'>
        <div class="product-feature__thumb">
          <img src="${eventData.mainImage}" alt="${eventData.title}" />
          <div class="product-feature__pagination" aria-label="이미지 페이지네이션">
            ${dots}
          </div>
        </div>

        <div class="product-feature__info">
          <div class="product-feature__composition" aria-label="상품 구성">
            <span class="composition-label">상품 구성</span>
            <div class="composition-thumbs">
              ${compositionThumbs}
            </div>
          </div>

          <div class="product-feature__bottom">
            <div class="product-feature__price-box">
              <div class="price-row-sm">
                <span class="label">할인적용가</span>
                <span class="original-price">${eventData.price.original}</span>
              </div>
              <div class="price-row-lg">
                <span class="discount-rate">${eventData.price.rate}</span>
                <span class="final-price">${eventData.price.final}</span>
              </div>
            </div>

            <button type="button" class="btn-cart-icon" aria-label="장바구니 담기">
              <span>담기</span>
            </button>
          </div>
        </div>
      </article>
    </section>
  `;
};

const renderBrandGrid = (brandsData) => {
  const brandGrid = document.querySelector('.brand-grid');
  if (!brandGrid) return;

  const html = brandsData.map(brand => `
    <li class="brand-card ${brand.className || ''}">
      <a href="#">
        <div class="brand-card__thumb">
          <div class="brand-card__overlay">
            <img class="brand-card__logo" src="${brand.logo}" alt="${brand.name}" />
            <span class="brand-card__shop-label">BRAND SHOP</span>
          </div>
          <img class="brand-card__bg" src="${brand.bg}" alt="" aria-hidden="true" />
        </div>
      </a>
      <span class="brand-card__name">${brand.name}</span>
    </li>
  `).join('');

  brandGrid.innerHTML = html;
};

const renderMainTitle = (eventData) => {
  return `
    <section class="main-title-section">
      <h3 class="main-title-section__title">${eventData.title}</h3>
      <p class="main-title-section__desc">${eventData.desc}</p>
    </section>
  `;
};

const renderEvents = (eventsData) => {
  const container = document.querySelector('#panel-event .container');
  if (!container) return;

  const html = eventsData.map((event, index) => {
    if (event.type === 'brand-carousel') return renderBrandCarousel(event);
    if (event.type === 'product-grid') return renderProductGrid(event);
    if (event.type === 'product-feature') return renderProductFeature(event);
    if (event.type === 'main-title') return renderMainTitle(event);
    return '';
  }).join('');

  container.innerHTML = html;
};

// 3. Interactive Logic (Refactored to Named Functions)

const initCart = () => {
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

  // Bind dynamically created buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.btn-cart-icon') || e.target.closest('.btn-cart-square')) {
      e.preventDefault();
      cartCount++;
      updateCartBadge();
      showToast("장바구니에 담겼습니다 :)");
    }
  });
};

const initHeaderInteraction = () => {
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
};

const initBreadcrumb = () => {
  const breadcrumbToggle = document.querySelector(".breadcrumb-toggle");
  const breadcrumbDropdown = document.querySelector(".breadcrumb-dropdown");
  const currentBreadcrumb = document.querySelector("#breadcrumb-current");

  // Set current breadcrumb text based on variant
  if (currentBreadcrumb && data.hero.title) {
    // Remove <br> tags for breadcrumb text
    currentBreadcrumb.textContent = data.hero.title.replace(/<br\s*\/?>/gi, ' ');
  }

  // Highlight current variant in dropdown
  const dropdownLinks = document.querySelectorAll(".breadcrumb-dropdown a");
  dropdownLinks.forEach(link => {
    if (link.dataset.variant === variantKey) {
      link.classList.add("is-active");
    }
  });

  if (breadcrumbToggle && breadcrumbDropdown) {
    const toggleDropdown = () => {
      const isHidden = breadcrumbDropdown.hidden;
      breadcrumbDropdown.hidden = !isHidden;
      breadcrumbToggle.classList.toggle("is-active", isHidden);
      breadcrumbToggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
    };

    breadcrumbToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    document.addEventListener("click", (e) => {
      if (!breadcrumbDropdown.hidden && !breadcrumbDropdown.contains(e.target) && !breadcrumbToggle.contains(e.target)) {
        breadcrumbDropdown.hidden = true;
        breadcrumbToggle.classList.remove("is-active");
        breadcrumbToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
};

const initTabs = () => {
  const tabs = document.querySelectorAll(".hero-tabs__btn[role='tab']");
  const panels = [
    document.getElementById("panel-event"),
    document.getElementById("panel-recommend"),
    document.getElementById("panel-all"),
  ].filter(Boolean);

  if (!tabs.length || !panels.length) return;

  const menuLayer = document.querySelector("#menu-layer");
  const menuBtn = document.querySelector(".hd-header__menu");

  const closeMenuLayer = () => {
      if (!menuLayer || !menuBtn) return;
      menuLayer.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
  };

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
};

const initEvent2Slider = () => {
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

  let currentPage = 0;
  const updatePage = (index) => {
    if (index < 0 || index >= dots.length) return;
    currentPage = index;
    goToPage(currentPage);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => updatePage(index));
  });

  if (barTracker) {
    barTracker.addEventListener("click", (e) => {
      const rect = barTracker.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const totalPages = dots.length;

      if (totalPages > 0) {
        const index = Math.min(Math.floor((x / width) * totalPages), totalPages - 1);
        updatePage(index);
      }
    });
  }

  const prevBtn = event2Section.querySelector(".btn-prev");
  const nextBtn = event2Section.querySelector(".btn-next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => updatePage(currentPage - 1));
    nextBtn.addEventListener("click", () => updatePage(currentPage + 1));
  }

  // Initial state
  updatePage(0);
};

const initBrandCarousel = () => {
  const carousels = document.querySelectorAll('.brand-carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.brand-track');
    const prevBtn = carousel.querySelector('.btn-prev');
    const nextBtn = carousel.querySelector('.btn-next');
    const bar = carousel.querySelector('.scroll-tracker__bar');
    
    if (!track) return;

    const itemWidth = 160 + 24; // card width + gap
    const visibleItems = 6;
    const totalItems = track.children.length;
    const maxIndex = Math.max(0, totalItems - visibleItems);
    let currentIndex = 0;

    const updateCarousel = () => {
      // Move track
      const translateX = -(currentIndex * itemWidth);
      track.style.transform = `translateX(${translateX}px)`;

      // Update buttons
      if (prevBtn) {
        prevBtn.setAttribute('aria-disabled', currentIndex === 0);
      }
      if (nextBtn) {
        nextBtn.setAttribute('aria-disabled', currentIndex >= maxIndex);
      }

      // Update scroll bar
      if (bar) {
        const progress = maxIndex > 0 ? currentIndex / maxIndex : 0;
        // The bar is 50% width. It can move another 50% (100% translation).
        bar.style.transform = `translateX(${progress * 100}%)`; 
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      });
    }

    // Initial update
    updateCarousel();
  });
};

const initProductFeature = () => {
  const features = document.querySelectorAll('.product-feature');

  features.forEach(feature => {
    const mainImg = feature.querySelector('.product-feature__thumb img');
    const dots = feature.querySelectorAll('.product-feature__pagination .dot');
    const thumbsContainer = feature.querySelector('.composition-thumbs');
    
    // Data for images is stored in data-images attribute
    const imagesData = JSON.parse(feature.dataset.images || '[]');

    const updateImage = (index) => {
      if (!imagesData[index] || !mainImg) return;
      
      mainImg.src = imagesData[index];
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => updateImage(index));
    });

    // Delegate click for thumbs to handle dynamic changes
    if (thumbsContainer) {
      thumbsContainer.addEventListener('click', (e) => {
        const thumb = e.target.closest('.composition-thumb');
        if (!thumb) return;

        // If it's the "more" thumb, do nothing (just update image if needed, or prevent default)
        if (thumb.classList.contains('more-thumb')) {
           // Do nothing or just update image
           // const index = Array.from(thumbsContainer.children).indexOf(thumb);
           // updateImage(index);
           return; 
        }

        const index = Array.from(thumbsContainer.children).indexOf(thumb);
        updateImage(index);
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render Initial Content
  renderHero(data.hero);
  renderBrandGrid(data.brands);
  renderEvents(data.events);

  // 2. Initialize Interactions
  initCart();
  initHeaderInteraction();
  initBreadcrumb();
  initTabs();
  initEvent2Slider();
  initBrandCarousel();
  initProductFeature();
});
