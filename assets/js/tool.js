/* ============================================================================
   tool.js — renders ANY tool page from ?id=<project-id>
   ============================================================================ */
(function(){
  const $ = s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));

  /* theme (light-primary) */
  const themeBtn=$('#themeBtn'), themeTop=$('#themeTop');
  const THEME_KEY='ads_theme_v2';   /* shared with the landing page */
  function setTheme(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem(THEME_KEY,t);
    themeBtn.innerHTML=ICON(t==='dark'?'sun':'moon');
    if(themeTop)themeTop.innerHTML=ICON(t==='dark'?'sun':'moon')+`<span>${t==='dark'?'Light':'Dark'}</span>`;}
  setTheme(localStorage.getItem(THEME_KEY)||'dark');
  const toggleTheme=()=>setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  themeBtn.onclick=toggleTheme; if(themeTop)themeTop.onclick=toggleTheme;
  $('#railToggle').innerHTML=ICON('menu'); $('#railToggle').onclick=()=>$('#rail').classList.toggle('open');
  $('#crumbSep').innerHTML=ICON('arrow','')||''; $('#crumbSep').style.cssText='display:inline-flex;width:14px';
  $('#backBtn').innerHTML=ICON('back')+' Back';

  const id=new URLSearchParams(location.search).get('id');
  const p=(window.PROJECTS||[]).find(x=>x.id===id);
  const mount=$('#tp');

  if(!p){
    mount.innerHTML=`<div class="empty"><div>${ICON('search')}</div><p>Tool not found.</p>
      <a class="btn primary" href="index.html" style="margin-top:14px">${ICON('back')} All Projects</a></div>`;
    return;
  }
  document.title=`${p.name} — AI Research & Innovation`;
  $('#crumbNow').textContent=p.name;

  const d=derive(p.efficiency), st=STATUS[p.status], pg=p.page||{}, m=p.media||{};
  const km=kindMeta(p.kind), dm=domainMeta(p.domain);

  /* ---- what this page actually has ---- */
  const hasMedia  = !!((m.videos&&m.videos.length)||(m.html&&m.html.length)||(m.gallery&&m.gallery.length)||
                       (m.docs&&m.docs.length)||(m.beforeAfter&&m.beforeAfter.before));
  const hasWork   = !!(pg.objective||p.description||pg.problem||pg.solution);
  const hasHow    = !!(pg.howItWorks&&pg.howItWorks.length);
  const hasDetail = !!((pg.timeline&&pg.timeline.length)||(pg.challenges&&pg.challenges.length)||
                       (pg.lessons&&pg.lessons.length)||(pg.roadmap&&pg.roadmap.length));
  const relList   = (p.related||[]).map(rid=>PROJECTS.find(x=>x.id===rid)).filter(Boolean);

  const sections=['overview'];
  if(d)         sections.push('efficiency');
  if(hasMedia)  sections.push('media');
  if(hasWork)   sections.push('work');
  if(hasHow)    sections.push('how');
  if(hasDetail) sections.push('detail');
  if(relList.length) sections.push('related');

  const SEC_LABEL={overview:'Overview',efficiency:'Impact',work:'What it does',how:'How it works',
                   media:'Demos & media',detail:'Development notes',related:'Related tools'};
  const SEC_ICON ={overview:'target',efficiency:'gauge',work:'route',how:'layers',
                   media:'film',detail:'book',related:'grid'};

  /* A jump list only earns its place on a page long enough to need one. */
  const jump = sections.length>=4
    ? `<div class="nav-group-label">On this page</div>`+
      sections.map(sec=>`<a class="nav-item" href="#${sec}"><span class="ic">${ICON(SEC_ICON[sec])}</span><span>${SEC_LABEL[sec]}</span></a>`).join('')
    : '';

  /* Without a jump list the rail is left almost empty, so short pages offer
     siblings from the same category instead — somewhere to go next. */
  let siblings='';
  if(!jump){
    const sibs=PROJECTS.filter(x=>x.id!==p.id && x.domain===p.domain).slice(0,5);
    if(sibs.length){
      siblings=`<div class="nav-group-label">More in ${domainMeta(p.domain).label}</div>`+
        sibs.map(x=>`<a class="nav-item" href="tool.html?id=${x.id}"><span class="ic">${ICON(kindMeta(x.kind).icon)}</span><span>${x.name}</span></a>`).join('');
    }
  }

  $('#nav').innerHTML = jump + siblings +
    `<div class="nav-group-label">More</div>`+
    `<a class="nav-item" href="index.html"><span class="ic">${ICON('grid')}</span><span>All Projects</span></a>`;

  /* ---- HERO ---- */
  const techRow=(p.tech||[]).map(t=>`<span class="badge" style="gap:7px"><span style="width:15px;height:15px;display:grid;place-items:center">${logoImg(t,15)}</span>${logoLabel(t)}</span>`).join('');
  /* Real screenshot if there is one, otherwise the generated placeholder.
     No facts panel here — code, status and stage are already in the badge row
     right next to it, and the impact strip below carries the numbers. */
  const heroImg = m.hero
    ? `<img src="${m.hero}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">${PLACEHOLDER(p,{label:true,hidden:true})}`
    : PLACEHOLDER(p,{label:true});
  const heroRight = `<div class="heroart">${heroImg}</div>`;
  const hero=`<section class="tp-hero reveal" id="overview">
    <div class="glow"></div>
    <div class="inner">
      <div>
        <div class="logo-lg">${logoImg(p.logo,36)}</div>
        <h1 class="h-1" style="margin:0 0 10px">${p.name}</h1>
        <p class="lead">${p.tagline}</p>
        <div class="metajoin">
          <span class="badge code">${p.code}</span>
          <span class="badge"><span class="dot ${st.cls}"></span>${st.label}</span>
          <span class="badge kindbadge" title="${km.blurb}">${ICON(km.icon)}${km.label}</span>
          <span class="badge">${ICON(dm.icon)}${dm.label}</span>
        </div>
        <div class="tech-row" style="margin-top:18px;gap:8px">${techRow}</div>
      </div>
      <div class="hero-right">${heroRight}</div>
    </div>
  </section>`;

  /* ---- IMPACT — a strip under the hero, not a section of its own ---- */
  let impact='';
  if(d){
    impact=`<div class="impact" id="efficiency">
      <div class="eff-block">
        <div class="eff-metric hero-metric"><div class="v">${d.pct}<span class="u">%</span></div><div class="l">Efficiency gain</div></div>
        <div class="eff-metric"><div class="v">${d.saved}<span class="u">hrs/wk</span></div><div class="l">Manual work removed</div></div>
        <div class="eff-metric"><div class="v">${d.speed?d.speed:'—'}<span class="u">×</span></div><div class="l">Faster than manual</div></div>
        <div class="eff-metric"><div class="v">${d.manual}<span class="u">hrs</span></div><div class="l">Manual, per week</div></div>
      </div>
      <div class="compare">
        <div class="row"><span class="name">Manual</span><span class="track"><span class="fill manual" style="--w:100%"></span></span><span class="val">${d.manual} hrs/wk</span></div>
        <div class="row"><span class="name">With this tool</span><span class="track"><span class="fill tool" style="--w:${d.manual>0?Math.max(4,(d.ai/d.manual*100)):0}%"></span></span><span class="val">${d.ai} hrs/wk</span></div>
      </div>
      ${d.draft?`<p class="note">Draft estimate — observed manual vs. tool hours, not yet confirmed.</p>`:''}
    </div>`;
  }else{
    impact=`<p class="note standalone">Time saved by this tool has not been measured yet.</p>`;
  }

  /* ---- WHAT IT DOES — one claim, then a before/after picture ----
     The prose is still here, but folded away. What a reader meets first is a
     single sentence and two contrasting cards, not four paragraphs. */
  const claim = pg.objective || p.tagline || '';
  const full  = (p.description && p.description!==pg.objective) ? p.description : '';
  const fromto = (pg.problem||pg.solution) ? `<div class="fromto">
      <div class="ft-card before"><div class="ft-h">${ICON('clock')}<span>Before</span></div>
        <p class="clamp3">${pg.problem||'—'}</p></div>
      <div class="ft-arrow">${ICON('arrow')}</div>
      <div class="ft-card after"><div class="ft-h">${ICON('check')}<span>With this tool</span></div>
        <p class="clamp3">${pg.solution||'—'}</p></div>
    </div>`:'';
  const work = hasWork ? `<section class="section" id="work">
    <div class="section-head"><div class="t"><div class="eyebrow">Overview</div><h2 class="h-2">What it does</h2></div></div>
    ${claim?`<p class="claim">${claim}</p>`:''}
    ${fromto}
    ${full?`<details class="more"><summary>Full description</summary><p>${full}</p></details>`:''}
  </section>`:'';

  /* ---- HOW IT WORKS — a left-to-right flow, not a stack of paragraphs ---- */
  const how = hasHow ? `<section class="section" id="how">
    <div class="section-head"><div class="t"><div class="eyebrow">${dm.label}</div><h2 class="h-2">How it works</h2></div></div>
    <div class="flow">${pg.howItWorks.map((x,i)=>
      (i?`<div class="fsep">${ICON('arrow')}</div>`:'')+
      `<div class="fnode reveal"><div class="fnum">${String(i+1).padStart(2,'0')}</div>
        <h4>${x.title}</h4><p class="clamp2">${x.detail}</p></div>`).join('')}</div>
  </section>`:'';

  /* ---- MEDIA — rendered only when there is something to show ---- */
  const media = hasMedia ? renderMedia() : '';
  function renderMedia(){
    const blocks=[];
    if(m.videos&&m.videos.length){
      blocks.push(`<div class="section-sub"><div style="display:grid;gap:16px;grid-template-columns:${m.videos.length>1?'repeat(auto-fit,minmax(320px,1fr))':'1fr'}">
        ${m.videos.map((v,i)=>videoBlock(v,i)).join('')}</div></div>`);
    }
    if(m.html&&m.html.length){
      blocks.push(m.html.map(src=>`<div class="section-sub" style="margin-top:18px">
        <div class="preview-cta">
          <div class="pc-left"><span class="pc-ic">${ICON('code')}</span>
            <div><b>Live interactive preview</b><p class="small">Opens in this tab — use Back to return.</p></div></div>
          <a class="open-preview" href="${src}">Open live preview ${ICON('arrow')}</a>
        </div></div>`).join(''));
    }
    if(m.beforeAfter&&m.beforeAfter.before){
      blocks.push(`<div class="section-sub" style="margin-top:18px"><div class="eyebrow" style="margin-bottom:10px">Before / after</div>
        <div class="cols-2">
          <div class="gallery"><div class="shot" data-full="${m.beforeAfter.before}"><img src="${m.beforeAfter.before}" alt="Before" loading="lazy"></div></div>
          <div class="gallery"><div class="shot" data-full="${m.beforeAfter.after}"><img src="${m.beforeAfter.after}" alt="After" loading="lazy"></div></div>
        </div></div>`);
    }
    if(m.gallery&&m.gallery.length){
      blocks.push(`<div class="section-sub" style="margin-top:18px">
        <div class="gallery">${m.gallery.map(g=>`<div class="shot" data-full="${g}"><img src="${g}" alt="screenshot" loading="lazy"></div>`).join('')}</div></div>`);
    }
    if(m.docs&&m.docs.length){
      blocks.push(`<div class="section-sub" style="margin-top:18px">
        <div class="chips">${m.docs.map(dc=>`<a class="btn ghost" href="${dc.src}" target="_blank">${ICON('down')} ${dc.title}</a>`).join('')}</div></div>`);
    }
    return `<section class="section" id="media">
      <div class="section-head"><div class="t"><div class="eyebrow">Showcase</div><h2 class="h-2">Demos &amp; media</h2></div></div>
      ${blocks.join('')}</section>`;
  }
  function videoBlock(v,i){
    const poster = v.poster || (v.type==='youtube'?`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`:'');
    const posImg = poster?`<img src="${poster}" alt="${v.title||''}">`:'';
    return `<div class="media-video" data-type="${v.type}" data-id="${v.id||''}" data-src="${v.src||''}">
      ${posImg}<div class="play"><div class="pbtn">${ICON('play')}</div></div>
      ${v.title?`<div class="cap">${v.title}</div>`:''}</div>`;
  }

  /* ---- DEVELOPMENT NOTES — a milestone rail plus three short lists ---- */
  function bit(title,items,icon,color){
    return `<div><div class="eyebrow">${title}</div>
      <ul class="list-clean" style="margin-top:14px">${items.map(i=>`<li><span class="mk" style="color:${color}">${ICON(icon)}</span><span>${i}</span></li>`).join('')}</ul></div>`;
  }
  const rail = (pg.timeline&&pg.timeline.length) ? `<div class="eyebrow">Timeline</div>
    <div class="milestones">${pg.timeline.map(t=>`<div class="ms"><div class="d">${t.date}</div><div class="l">${t.label}</div></div>`).join('')}</div>`:'';
  const lists=[];
  if(pg.challenges&&pg.challenges.length) lists.push(bit('Challenges',pg.challenges,'route','var(--amber-400)'));
  if(pg.lessons&&pg.lessons.length)       lists.push(bit('Lessons learned',pg.lessons,'book','var(--emerald-400)'));
  if(pg.roadmap&&pg.roadmap.length)       lists.push(bit('What\u2019s next',pg.roadmap,'sparkle','var(--violet-400)'));
  const detail = (rail||lists.length) ? `<section class="section" id="detail">
    <div class="section-head"><div class="t"><div class="eyebrow">Behind the build</div><h2 class="h-2">Development notes</h2></div></div>
    <div class="panel pad">${rail}
      ${lists.length?`<div class="detail-grid"${rail?' style="margin-top:28px;padding-top:26px;border-top:1px solid var(--line)"':''}>${lists.join('')}</div>`:''}
    </div></section>`:'';

  /* ---- RELATED ---- */
  const related = relList.length ? `<section class="section" id="related">
      <div class="section-head"><div class="t"><div class="eyebrow">Part of the ecosystem</div><h2 class="h-2">Related tools</h2></div></div>
      <div class="related">${relList.map(r=>`<a class="rel-card" href="tool.html?id=${r.id}">
        <div class="rc-code">${r.code} · ${STATUS[r.status].label}</div><h4>${r.name}</h4><p>${r.tagline}</p></a>`).join('')}</div></section>`:'';

  /* ---- assemble ---- */
  mount.innerHTML = hero+impact+media+work+how+detail+related+
    `<footer class="foot"><a href="index.html" style="color:var(--text-2)">${ICON('back')} All Projects</a>
      <span class="tag gradient-text">Increasing Efficiency. One Tool at a Time.</span></footer>`;

  /* ---- interactions ---- */
  // comparison bars grow via CSS animation — no rAF, so they are never left empty

  // video play → swap in player
  mount.addEventListener('click',e=>{
    const vb=e.target.closest('.media-video'); if(vb){ playVideo(vb); return; }
    const shot=e.target.closest('.shot'); if(shot){ openLightbox(shot.dataset.full); }
  });
  function playVideo(el){
    const type=el.dataset.type;
    if(type==='youtube'){
      el.innerHTML=`<iframe src="https://www.youtube.com/embed/${el.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="video"></iframe>`;
    }else{
      el.innerHTML=`<video src="${el.dataset.src}" controls autoplay playsinline preload="metadata"></video>`;
    }
    el.style.cursor='default';
  }

  // lightbox
  const lb=$('#lightbox'), lbImg=$('#lbImg');
  $('#lbClose').innerHTML=ICON('x');
  function openLightbox(src){ lbImg.src=src; lb.classList.add('open'); }
  lb.addEventListener('click',e=>{ if(e.target===lb||e.target.closest('.x')) lb.classList.remove('open'); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') lb.classList.remove('open'); });

  // reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -6% 0px'});
  $$('.reveal').forEach(el=>io.observe(el));
})();
