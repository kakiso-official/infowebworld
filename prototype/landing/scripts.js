/* ============================================================
   InfoWebWorld. - Landing Page Scripts
   ============================================================ */

// Widget loader - fetches HTML widget files and injects into containers
function loadWidget(containerId, widgetPath) {
  const container = document.getElementById(containerId);
  if (!container) return Promise.resolve();
  return fetch(widgetPath)
    .then(function(response) {
      if (!response.ok) throw new Error('Failed to load ' + widgetPath);
      return response.text();
    })
    .then(function(html) {
      container.innerHTML = html;
    })
    .catch(function(err) {
      console.warn('[InfoWebWorld.] Widget load error:', err.message);
    });
}

// Load all widgets then initialize animations
function initApp() {
  var widgets = [
    { id: 'widget-nav',          path: 'landing/nav.html' },
    { id: 'widget-hero',         path: 'landing/hero.html' },
    { id: 'widget-logos',        path: 'landing/logos.html' },
    { id: 'widget-categories',   path: 'landing/categories.html' },
    { id: 'widget-featured',     path: 'landing/featured.html' },
    { id: 'widget-reviews',      path: 'landing/reviews.html' },
    { id: 'widget-news',         path: 'landing/news.html' },
    { id: 'widget-trending',     path: 'landing/trending.html' },
    { id: 'widget-value-props',  path: 'landing/value-props.html' },
    { id: 'widget-testimonials', path: 'landing/testimonials.html' },
    { id: 'widget-cta',          path: 'landing/cta.html' },
    { id: 'widget-footer',       path: 'landing/footer.html' }
  ];

  Promise.all(widgets.map(function(w) {
    return loadWidget(w.id, w.path);
  })).then(function() {
    // If Figma capture is active, show everything immediately (no animations)
    if (window.location.hash.indexOf('figmacapture') !== -1) {
      document.querySelectorAll('.fade-section').forEach(function(el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
        el.classList.add('visible');
      });
      return;
    }
    initNavScroll();
    initFadeAnimations();
    initStaggerAnimations();
    initHeroRotate();
    initMobileNav();
    initTrendBars();
  });
}

// Sticky nav shadow on scroll
function initNavScroll() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// IntersectionObserver for fade-in animations
function initFadeAnimations() {
  var fadeSections = document.querySelectorAll('.fade-section');
  var observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = '0s';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  fadeSections.forEach(function(el) {
    observer.observe(el);
  });
}

// Staggered animation for grid children
function initStaggerAnimations() {
  var staggerObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var children = entry.target.querySelectorAll('.cat-card, .listing-card, .review-card, .review-card-v2, .review-featured, .trending-item, .trend-podium-card, .trend-row, .trend-item, .prop-card, .test-card, .news-compact, .news-card-v2');
        children.forEach(function(child, i) {
          child.style.opacity = '0';
          child.style.transform = 'translateY(16px)';
          child.style.transition = 'opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1)';
          child.style.transitionDelay = (i * 0.06) + 's';
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            });
          });
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.categories-grid, .featured-masonry, .featured-grid, .reviews-grid-v2, .trend-grid, .props-grid, .testimonials-grid, .news-grid-v2').forEach(function(grid) {
    staggerObserver.observe(grid);
  });
}

// Rotating hero headline words (opacity fade swap)
function initHeroRotate() {
  var wrap = document.querySelector('.hero-rotate-wrap');
  if (!wrap) return;
  var items = wrap.querySelectorAll('.hero-rotate-word');
  if (items.length < 2) return;
  var current = 0;
  setInterval(function() {
    items[current].classList.remove('active');
    current = (current + 1) % items.length;
    items[current].classList.add('active');
  }, 2400);
}

// Mobile nav drawer toggle
function initMobileNav() {
  var toggle = document.querySelector('.nav-mobile-toggle');
  var drawer = document.getElementById('nav-drawer');
  var overlay = document.getElementById('nav-overlay');
  var close = document.getElementById('nav-close');
  if (!toggle || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openDrawer);
  if (close) close.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
}

// Animated progress bars in trending section
function initTrendBars() {
  var bars = document.querySelectorAll('.trend-bar[data-width]');
  if (!bars.length) return;
  var barObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var barsInView = entry.target.querySelectorAll('.trend-bar[data-width]');
        barsInView.forEach(function(bar, i) {
          setTimeout(function() {
            bar.style.width = bar.getAttribute('data-width') + '%';
          }, i * 80);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  // Observe the parent containers
  var podium = document.querySelector('.trend-podium');
  var leaderboard = document.querySelector('.trend-leaderboard');
  if (podium) barObserver.observe(podium);
  if (leaderboard) barObserver.observe(leaderboard);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);