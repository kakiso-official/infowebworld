/* ===== Category Page – Widget Loader & Interactions ===== */
(function(){
  /* ---- Widget loader ---- */
  async function loadWidget(id, path){
    const el=document.getElementById(id);
    if(!el) return;
    try{
      const r=await fetch(path);
      if(!r.ok) throw new Error(r.status);
      el.innerHTML=await r.text();
    }catch(e){console.error('Widget load error:',path,e)}
  }

  async function initApp(){
    await Promise.all([
      loadWidget('widget-header','category/header.html'),
      loadWidget('widget-filters','category/filters.html'),
      loadWidget('widget-listings','category/listings.html'),
      loadWidget('widget-sidebar','category/sidebar.html')
    ]);
    initFilters();
    initViewToggle();
    initChips();
    initFadeAnimations();
    initFilterDrawer();
    initPagination();
    initRatingFilter();
    initCompare();
  }

  /* ---- Collapsible filter cards ---- */
  function initFilters(){
    document.querySelectorAll('.filter-card-head').forEach(head=>{
      head.addEventListener('click',()=>{
        head.closest('.filter-card').classList.toggle('collapsed');
      });
    });
    const clear=document.getElementById('filter-clear');
    if(clear){
      clear.addEventListener('click',()=>{
        document.querySelectorAll('.filter-card input[type="checkbox"]').forEach(cb=>{cb.checked=false});
        document.querySelectorAll('.f-rating-row').forEach(r=>r.classList.remove('active'));
      });
    }
  }

  /* ---- Grid / List view toggle ---- */
  function initViewToggle(){
    const grid=document.getElementById('view-grid');
    const list=document.getElementById('view-list');
    const g=document.getElementById('cat-grid');
    if(!grid||!list||!g) return;
    grid.addEventListener('click',()=>{
      grid.classList.add('active');list.classList.remove('active');
      g.classList.remove('list-view');
    });
    list.addEventListener('click',()=>{
      list.classList.add('active');grid.classList.remove('active');
      g.classList.add('list-view');
    });
  }

  /* ---- Quick filter chips ---- */
  function initChips(){
    document.querySelectorAll('.cat-chip').forEach(chip=>{
      chip.addEventListener('click',()=>{
        document.querySelectorAll('.cat-chip').forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  /* ---- Rating filter ---- */
  function initRatingFilter(){
    document.querySelectorAll('.f-rating-row').forEach(row=>{
      row.addEventListener('click',()=>{
        document.querySelectorAll('.f-rating-row').forEach(r=>r.classList.remove('active'));
        row.classList.add('active');
      });
    });
  }

  /* ---- Fade-in on scroll ---- */
  function initFadeAnimations(){
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach((e,i)=>{
        if(e.isIntersecting){
          setTimeout(()=>{e.target.classList.add('visible')},i*60);
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.05,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
  }

  /* ---- Mobile filter drawer ---- */
  function initFilterDrawer(){
    const toggle=document.getElementById('filter-toggle');
    const filters=document.querySelector('.cat-filters');
    const overlay=document.getElementById('filter-overlay');
    if(!toggle||!filters||!overlay) return;
    toggle.addEventListener('click',()=>{
      filters.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow='hidden';
    });
    overlay.addEventListener('click',()=>{
      filters.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow='';
    });
  }

  /* ---- Pagination ---- */
  function initPagination(){
    document.querySelectorAll('.cat-page').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.cat-page').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        window.scrollTo({top:document.querySelector('.cat-toolbar').offsetTop-80,behavior:'smooth'});
      });
    });
  }

  /* ---- Compare floating bar ---- */
  function initCompare(){
    const bar=document.getElementById('compare-bar');
    const countEl=document.getElementById('cmp-count');
    const clearBtn=document.getElementById('cmp-clear');
    if(!bar||!countEl) return;
    function updateBar(){
      const checked=document.querySelectorAll('.cmp-check:checked').length;
      countEl.textContent=checked;
      if(checked>0) bar.classList.add('visible'); else bar.classList.remove('visible');
    }
    document.addEventListener('change',function(e){
      if(e.target.classList.contains('cmp-check')) updateBar();
    });
    if(clearBtn){
      clearBtn.addEventListener('click',function(){
        document.querySelectorAll('.cmp-check:checked').forEach(cb=>{cb.checked=false});
        updateBar();
      });
    }
  }

  /* ---- Boot ---- */
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initApp)}
  else{initApp()}
})();
