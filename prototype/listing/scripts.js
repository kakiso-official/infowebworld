/* ===== Listing Page – Widget Loader & Interactions ===== */
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
      loadWidget('widget-header','listing/header.html'),
      loadWidget('widget-overview','listing/overview.html'),
      loadWidget('widget-reviews','listing/reviews.html'),
      loadWidget('widget-sidebar','listing/sidebar.html')
    ]);
    initTabs();
    initFadeAnimations();
    initReadMore();
    initScreenshotScroll();
    initReviewHelpful();
    initSaveShare();
  }

  /* ---- Sticky tabs with smooth scroll ---- */
  function initTabs(){
    const tabs=document.querySelectorAll('.ls-tab');
    if(!tabs.length) return;
    tabs.forEach(tab=>{
      tab.addEventListener('click',()=>{
        const target=tab.dataset.tab;
        const section=document.getElementById('ls-'+target);
        if(section){
          const offset=document.querySelector('.ls-tabs-wrap')?.offsetHeight||50;
          const top=section.getBoundingClientRect().top+window.pageYOffset-offset-10;
          window.scrollTo({top:top,behavior:'smooth'});
        }
        tabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    /* Scroll spy */
    const sections=['overview','features','pricing','reviews','alternatives'];
    const sectionEls=sections.map(s=>document.getElementById('ls-'+s)).filter(Boolean);
    if(sectionEls.length){
      const obs=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const id=entry.target.id.replace('ls-','');
            tabs.forEach(t=>{
              t.classList.toggle('active',t.dataset.tab===id);
            });
          }
        });
      },{threshold:0.15,rootMargin:'-80px 0px -60% 0px'});
      sectionEls.forEach(el=>obs.observe(el));
    }
  }

  /* ---- Fade-in on scroll ---- */
  function initFadeAnimations(){
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach((e,i)=>{
        if(e.isIntersecting){
          setTimeout(()=>{e.target.classList.add('visible')},i*40);
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.05,rootMargin:'0px 0px -20px 0px'});
    document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
  }

  /* ---- Read more toggle ---- */
  function initReadMore(){
    document.querySelectorAll('.ls-desc-more').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const desc=btn.previousElementSibling||btn.closest('.ls-section').querySelector('.ls-desc');
        if(!desc) return;
        if(desc.style.maxHeight){
          desc.style.maxHeight='';
          desc.style.overflow='';
          btn.textContent='Read more';
        }else{
          desc.style.maxHeight='none';
          desc.style.overflow='visible';
          btn.textContent='Show less';
        }
      });
    });
  }

  /* ---- Screenshot horizontal scroll arrows ---- */
  function initScreenshotScroll(){
    const container=document.querySelector('.ls-screenshots');
    if(!container) return;
    /* Touch drag support already native via overflow-x:auto */
    /* Add keyboard arrow support */
    container.setAttribute('tabindex','0');
    container.addEventListener('keydown',(e)=>{
      if(e.key==='ArrowRight') container.scrollBy({left:200,behavior:'smooth'});
      if(e.key==='ArrowLeft') container.scrollBy({left:-200,behavior:'smooth'});
    });
  }

  /* ---- Review helpful buttons ---- */
  function initReviewHelpful(){
    document.addEventListener('click',function(e){
      const btn=e.target.closest('.ls-review-helpful-btn');
      if(!btn) return;
      btn.classList.toggle('active');
      if(btn.classList.contains('active')){
        btn.style.color='var(--accent)';
      }else{
        btn.style.color='';
      }
    });
  }

  /* ---- Save & Share toggle ---- */
  function initSaveShare(){
    document.querySelectorAll('.ls-hero-actions .ls-btn-outline').forEach(btn=>{
      const text=btn.textContent.trim();
      if(text==='Save'||text==='Share'){
        btn.addEventListener('click',(e)=>{
          e.preventDefault();
          btn.classList.toggle('ls-btn-active');
          if(btn.classList.contains('ls-btn-active')){
            btn.style.borderColor='var(--accent)';
            btn.style.color='var(--accent)';
          }else{
            btn.style.borderColor='';
            btn.style.color='';
          }
        });
      }
    });
  }

  /* ---- Boot ---- */
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initApp)}
  else{initApp()}
})();