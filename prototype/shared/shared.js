/* ============================================================
   SHARED COMPONENTS — InfoWebWorld Header & Footer
   Auto-injects nav + footer into any page with:
     <div id="s-nav"></div>   and   <div id="s-footer"></div>
   ============================================================ */

(function() {
  // Detect path prefix for links (pages in subfolders need ../)
  var prefix = '';
  var path = window.location.pathname;
  if (path.indexOf('/admin/') !== -1 || path.indexOf('/dashboard/') !== -1) {
    prefix = '../';
  }

  var logoPath = prefix + 'logo/infowebworld-logo.png';

  // ---- NAV HTML ----
  var navHTML = '<nav class="s-nav" id="s-nav-bar">' +
    '<div class="s-container s-nav-inner">' +
      '<a href="' + prefix + 'index.html" class="s-nav-logo">' +
        '<img src="' + logoPath + '" alt="InfoWebWorld">' +
      '</a>' +
      '<div class="s-nav-links">' +
        '<div class="s-mega-wrapper">' +
          '<a href="' + prefix + 'category.html" class="s-nav-link s-nav-link--has-menu">' +
            'Categories <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>' +
          '</a>' +
          '<div class="s-mega-menu">' +
            '<a href="' + prefix + 'category.html?cat=technology-saas" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(108,114,241,.1)"><svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg></span><div><div class="s-mega-text">Technology & SaaS</div><div class="s-mega-count">520+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=restaurants-food" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(239,107,74,.1)"><svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg></span><div><div class="s-mega-text">Restaurants & Food</div><div class="s-mega-count">480+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=healthcare-wellness" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(47,174,106,.1)"><svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/><path d="M12 6v4"/><path d="M10 8h4"/></svg></span><div><div class="s-mega-text">Healthcare & Wellness</div><div class="s-mega-count">390+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=real-estate" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(59,130,246,.1)"><svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span><div><div class="s-mega-text">Real Estate & Property</div><div class="s-mega-count">350+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=legal-financial" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(139,92,246,.1)"><svg viewBox="0 0 24 24" stroke="var(--plum)"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/><path d="M12 12v2"/></svg></span><div><div class="s-mega-text">Legal & Financial</div><div class="s-mega-count">310+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=education-training" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(20,184,166,.1)"><svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg></span><div><div class="s-mega-text">Education & Training</div><div class="s-mega-count">280+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=marketing-creative" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(236,72,153,.1)"><svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg></span><div><div class="s-mega-text">Marketing & Creative</div><div class="s-mega-count">420+ listings</div></div></a>' +
            '<a href="' + prefix + 'category.html?cat=home-services" class="s-mega-item"><span class="s-mega-icon" style="background:rgba(245,158,11,.1)"><svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><div><div class="s-mega-text">Home Services & Trades</div><div class="s-mega-count">360+ listings</div></div></a>' +
          '</div>' +
        '</div>' +
        '<a href="' + prefix + 'best-of.html" class="s-nav-link">Featured</a>' +
        '<a href="' + prefix + 'news.html" class="s-nav-link">News</a>' +
        '<a href="' + prefix + 'pricing.html" class="s-nav-link">Pricing</a>' +
      '</div>' +
      '<div class="s-nav-right">' +
        '<a href="' + prefix + 'search.html" class="s-nav-search" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></a>' +
        '<a href="' + prefix + 'signin.html" class="s-nav-signin">Sign in</a>' +
        '<a href="' + prefix + 'submit-listing.html" class="s-nav-cta">Get Listed</a>' +
        '<button class="s-nav-mobile-toggle" aria-label="Menu"><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>' +
      '</div>' +
    '</div>' +
  '</nav>' +
  '<div class="s-nav-overlay" id="s-nav-overlay"></div>' +
  '<div class="s-nav-drawer" id="s-nav-drawer">' +
    '<div class="s-nav-drawer-header">' +
      '<a href="' + prefix + 'index.html"><img src="' + logoPath + '" alt="InfoWebWorld"></a>' +
      '<button class="s-nav-drawer-close" id="s-nav-close" aria-label="Close"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
    '</div>' +
    '<div class="s-nav-drawer-body">' +
      '<a href="' + prefix + 'search.html" class="s-nav-drawer-link">Search</a>' +
      '<a href="' + prefix + 'best-of.html" class="s-nav-drawer-link">Featured</a>' +
      '<a href="' + prefix + 'news.html" class="s-nav-drawer-link">News</a>' +
      '<a href="' + prefix + 'pricing.html" class="s-nav-drawer-link">Pricing</a>' +
      '<div class="s-nav-drawer-label">Browse Categories</div>' +
      '<a href="' + prefix + 'category.html?cat=technology-saas" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(108,114,241,.1)"><svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg></span>Technology & SaaS</a>' +
      '<a href="' + prefix + 'category.html?cat=restaurants-food" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(239,107,74,.1)"><svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg></span>Restaurants & Food</a>' +
      '<a href="' + prefix + 'category.html?cat=healthcare-wellness" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(47,174,106,.1)"><svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></span>Healthcare & Wellness</a>' +
      '<a href="' + prefix + 'category.html?cat=real-estate" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(59,130,246,.1)"><svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>Real Estate & Property</a>' +
      '<a href="' + prefix + 'category.html?cat=legal-financial" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(139,92,246,.1)"><svg viewBox="0 0 24 24" stroke="var(--plum)"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg></span>Legal & Financial</a>' +
      '<a href="' + prefix + 'category.html?cat=marketing-creative" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(236,72,153,.1)"><svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M3 11l18-5v12L3 13v-2z"/></svg></span>Marketing & Creative</a>' +
      '<a href="' + prefix + 'category.html?cat=home-services" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(245,158,11,.1)"><svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>Home Services & Trades</a>' +
      '<a href="' + prefix + 'category.html?cat=education-training" class="s-nav-drawer-cat"><span class="s-nav-drawer-cat-icon" style="background:rgba(20,184,166,.1)"><svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>Education & Training</a>' +
    '</div>' +
    '<div class="s-nav-drawer-footer">' +
      '<a href="' + prefix + 'signin.html" class="s-nav-signin">Sign in</a>' +
      '<a href="' + prefix + 'submit-listing.html" class="s-nav-cta">Get Listed</a>' +
    '</div>' +
  '</div>';

  // ---- FOOTER HTML ----
  var footerHTML = '<footer class="s-footer">' +
    '<div class="s-container">' +
      '<div class="s-footer-grid">' +
        '<div class="s-footer-brand">' +
          '<div class="s-footer-brand-logo"><img src="' + logoPath + '" alt="InfoWebWorld"></div>' +
          '<p class="s-footer-brand-desc">The trusted global directory for discovering, comparing, and reviewing businesses across every industry. From local services to enterprise solutions.</p>' +
          '<div class="s-footer-newsletter">' +
            '<div class="s-footer-newsletter-wrap">' +
              '<svg class="s-footer-newsletter-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
              '<input type="email" placeholder="Enter your email">' +
              '<button>Subscribe</button>' +
            '</div>' +
            '<span class="s-footer-newsletter-hint">Weekly industry insights. No spam.</span>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="s-footer-col-title">Platform</div>' +
          '<ul class="s-footer-links">' +
            '<li><a href="' + prefix + 'search.html">Browse Listings</a></li>' +
            '<li><a href="' + prefix + 'category.html">Categories</a></li>' +
            '<li><a href="' + prefix + 'comparison.html">Comparisons</a></li>' +
            '<li><a href="' + prefix + 'news.html">News</a></li>' +
            '<li><a href="' + prefix + 'best-of.html">Trending</a></li>' +
            '<li><a href="' + prefix + 'write-review.html">Write a Review</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<div class="s-footer-col-title">Company</div>' +
          '<ul class="s-footer-links">' +
            '<li><a href="' + prefix + 'about.html">About</a></li>' +
            '<li><a href="#">Careers</a></li>' +
            '<li><a href="' + prefix + 'blog.html">Blog</a></li>' +
            '<li><a href="#">Press</a></li>' +
            '<li><a href="' + prefix + 'contact.html">Contact</a></li>' +
            '<li><a href="#">Privacy Policy</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<div class="s-footer-col-title">For Businesses</div>' +
          '<ul class="s-footer-links">' +
            '<li><a href="' + prefix + 'submit-listing.html">Get Listed</a></li>' +
            '<li><a href="' + prefix + 'pricing.html">Pricing</a></li>' +
            '<li><a href="' + prefix + 'dashboard/index.html">Vendor Dashboard</a></li>' +
            '<li><a href="' + prefix + 'submit-listing.html">Claim Your Listing</a></li>' +
            '<li><a href="#">Advertising</a></li>' +
            '<li><a href="#">API Access</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="s-footer-bottom">' +
        '<div class="s-footer-bottom-left">' +
          '<span class="s-footer-copy">2026 InfoWebWorld. All rights reserved.</span>' +
          '<div class="s-footer-legal"><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a></div>' +
        '</div>' +
        '<div class="s-footer-bottom-right">' +
          '<div class="s-footer-socials">' +
            '<a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>' +
            '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>' +
            '<a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>' +
            '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>' +
          '</div>' +
          '<div class="s-footer-lang">' +
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
            '<span>English (US)</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</footer>';

  // ---- INJECT ----
  var navTarget = document.getElementById('s-nav');
  var footerTarget = document.getElementById('s-footer');
  if (navTarget) navTarget.innerHTML = navHTML;
  if (footerTarget) footerTarget.innerHTML = footerHTML;

  // ---- HIGHLIGHT ACTIVE NAV LINK ----
  var currentPage = window.location.pathname.split('/').pop().split('?')[0];
  var navLinks = document.querySelectorAll('.s-nav-link');
  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href.split('/').pop().split('?')[0] === currentPage) {
      link.classList.add('active');
    }
  });

  // ---- SCROLL SHADOW ----
  var nav = document.getElementById('s-nav-bar');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ---- MOBILE DRAWER ----
  var toggle = document.querySelector('.s-nav-mobile-toggle');
  var drawer = document.getElementById('s-nav-drawer');
  var overlay = document.getElementById('s-nav-overlay');
  var closeBtn = document.getElementById('s-nav-close');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
})();
