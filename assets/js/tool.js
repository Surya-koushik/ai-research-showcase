/* ============================================================================
   tool.js — renders ANY tool page from ?id=<project-id>
   ============================================================================ */
(function(){
  const $ = s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));

  /* theme (light-primary) */
  const themeBtn=$('#themeBtn'), themeTop=$('#themeTop');
  function setTheme(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem('ads_theme',t);
    themeBtn.innerHTML=ICON(t==='dark'?'sun':'moon');
    if(themeTop)themeTop.innerHTML=ICON(t==='dark'?'sun':'moon')+`<span>${t==='dark'?'Light':'Dark'}</span>`;}
  setTheme(localStorage.getItem('ads_theme')||'light');
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

  /* ---- section nav (jump links, only for sections that exist) ---- */
  const sections=[];
  const has=(k)=>sections.push(k);
  has('overview'); if(d||p.efficiency===null) has('efficiency');
  if(pg.problem||pg.solution) has('problem');
  if(pg.howItWorks&&pg.howItWorks.length) has('how');
  if(p.tech&&p.tech.length) has('tech');
  has('media');
  if(pg.timeline&&pg.timeline.length) has('timeline');
  if((pg.challenges&&pg.challenges.length)||(pg.lessons&&pg.lessons.length)) has('notes');
  if(pg.roadmap&&pg.roadmap.length) has('roadmap');
  if(p.related&&p.related.length) has('related');
  const SEC_LABEL={overview:'Overview',efficiency:'Efficiency',problem:'Problem & Solution',how:'How it works',tech:'Tech stack',media:'Media',timeline:'Timeline',notes:'Notes',roadmap:'Roadmap',related:'Related'};
  const SEC_ICON={overview:'target',efficiency:'gauge',problem:'route',how:'layers',tech:'code',media:'film',timeline:'clock',notes:'book',roadmap:'sparkle',related:'grid'};
  $('#nav').innerHTML=`<div class="nav-group-label">On this page</div>`+
    sections.map(s=>`<a class="nav-item" href="#${s}"><span class="ic">${ICON(SEC_ICON[s])}</span><span>${SEC_LABEL[s]}</span></a>`).join('')+
    `<div class="nav-group-label">More</div>`+
    `<a class="nav-item" href="index.html"><span class="ic">${ICON('grid')}</span><span>All Projects</span></a>`;

  /* ---- HERO ---- */
  const techRow=(p.tech||[]).map(t=>`<span class="badge" style="gap:7px"><span style="width:15px;height:15px;display:grid;place-items:center">${logoImg(t,15)}</span>${logoLabel(t)}</span>`).join('');
  const fact=(ic,label,val,unit,accent)=>`<div class="tp-fact${accent?' accent':''}"><div class="fl">${ICON(ic)}${label}</div><div class="fv">${val}${unit?`<small>${unit}</small>`:''}</div></div>`;
  const factsHTML = d
    ? `<div class="tp-facts">${fact('gauge','Efficiency',d.pct,'%',true)}${fact('clock','Time saved',d.saved,'hrs/wk')}${fact('sparkle','Faster',d.speed?d.speed+'×':'—','')}${fact('route','Manual',d.manual,'hrs/wk')}</div>`
    : `<div class="tp-facts">${fact('check','Status',st.label,'',true)}${fact('layers','Stage',p.workflowStage,'')}${fact('grid','Code',p.code,'')}${fact('code','Stack',(p.tech||[]).length,'tools')}</div>`;
  const heroRight = m.hero
    ? `<div class="heroart"><img src="${m.hero}" alt="${p.name}" onerror="this.parentElement.remove();var f=document.getElementById('tpFactsFallback');if(f)f.hidden=false"></div><div id="tpFactsFallback" hidden>${factsHTML}</div>`
    : factsHTML;
  const hero=`<section class="tp-hero reveal" id="overview">
    <div class="glow"></div>
    <div class="inner">
      <div>
        <div class="logo-lg">${logoImg(p.logo,36)}</div>
        <div class="metajoin">
          <span class="badge code">${p.code}</span>
          <span class="badge"><span class="dot ${st.cls}"></span>${st.label}</span>
          <span class="badge">${p.workflowStage}</span>
        </div>
        <h1 class="h-1" style="margin:4px 0 10px">${p.name}</h1>
        <p class="lead">${p.tagline}</p>
        <div class="tech-row" style="margin-top:18px;gap:8px">${techRow}</div>
      </div>
      <div class="hero-right">${heroRight}</div>
    </div>
  </section>`;

  /* ---- EFFICIENCY ---- */
  let efficiency='';
  if(d){
    const bars=`<div class="compare">
      <div class="row"><span class="name">Manual</span><span class="track"><span class="fill manual" data-w="100"></span></span><span class="val">${d.manual} hrs/wk</span></div>
      <div class="row"><span class="name">With this tool</span><span class="track"><span class="fill tool" data-w="${d.manual>0?Math.max(4,(d.ai/d.manual*100)):0}"></span></span><span class="val">${d.ai} hrs/wk</span></div>
    </div>`;
    efficiency=`<section class="section" id="efficiency">
      <div class="section-head"><div class="t"><div class="eyebrow">Measured impact ${d.draft?'· <span style="color:var(--amber-500)">DRAFT — confirm</span>':''}</div>
        <h2 class="h-2">Efficiency</h2></div></div>
      <div class="eff-block">
        <div class="eff-metric hero-metric"><div class="v">${d.pct}<span class="u">%</span></div><div class="l">Efficiency gain</div></div>
        <div class="eff-metric"><div class="v">${d.saved}<span class="u">hrs/wk</span></div><div class="l">Manual work removed</div></div>
        <div class="eff-metric"><div class="v">${d.speed?d.speed:'—'}<span class="u">×</span></div><div class="l">Faster than manual</div></div>
        <div class="eff-metric"><div class="v">${d.manual}<span class="u">hrs</span></div><div class="l">Manual, per week</div></div>
      </div>
      ${bars}
      <p class="small" style="margin-top:12px">${d.draft?'These are consistent draft estimates (manual vs. tool hours), derived by one formula. Replace with confirmed figures in <span class="mono">projects.js</span>.':'Confirmed figures.'}</p>
    </section>`;
  } else if(p.efficiency===null){
    efficiency=`<section class="section" id="efficiency">
      <div class="section-head"><div class="t"><div class="eyebrow">Measured impact</div><h2 class="h-2">Efficiency</h2></div></div>
      <div class="panel" style="padding:22px;display:flex;gap:14px;align-items:center">
        <span style="color:var(--violet-400)">${ICON('clock')}</span>
        <div><b>Impact not yet quantified.</b><p class="small" style="margin-top:4px">This tool is ${st.label.toLowerCase()}. Time-saving will be measured and added here — set <span class="mono">manualHrsPerWeek</span> / <span class="mono">aiHrsPerWeek</span> in <span class="mono">projects.js</span>.</p></div>
      </div></section>`;
  }

  /* ---- OVERVIEW / OBJECTIVE ---- */
  const overview = pg.objective ? `<section class="section" id="objective-sec">
    <div class="section-head"><div class="t"><div class="eyebrow">Overview</div><h2 class="h-2">Research objective</h2></div></div>
    <div class="prose"><p>${pg.objective}</p><p style="color:var(--text-3)">${p.description}</p></div></section>` : '';

  /* ---- PROBLEM / SOLUTION ---- */
  const problem = (pg.problem||pg.solution) ? `<section class="section" id="problem">
    <div class="cols-2">
      ${pg.problem?`<div class="panel" style="padding:24px"><div class="eyebrow" style="color:var(--rose-400)">The problem</div>
        <p class="prose" style="margin-top:10px"><p>${pg.problem}</p></p></div>`:''}
      ${pg.solution?`<div class="panel" style="padding:24px"><div class="eyebrow" style="color:var(--emerald-400)">The solution</div>
        <div class="prose" style="margin-top:10px"><p>${pg.solution}</p></div></div>`:''}
    </div></section>`:'';

  /* ---- HOW IT WORKS ---- */
  const how = (pg.howItWorks&&pg.howItWorks.length) ? `<section class="section" id="how">
    <div class="section-head"><div class="t"><div class="eyebrow">Where it sits in the workflow · ${p.workflowStage}</div><h2 class="h-2">How it works</h2></div></div>
    <div class="steps">${pg.howItWorks.map((s,i)=>`<div class="step reveal"><div class="num">${String(i+1).padStart(2,'0')}</div>
      <div class="st"><h4>${s.title}</h4><p>${s.detail}</p></div></div>`).join('')}</div></section>`:'';

  /* ---- TECH ---- */
  const tech = (p.tech&&p.tech.length) ? `<section class="section" id="tech">
    <div class="section-head"><div class="t"><div class="eyebrow">Built with</div><h2 class="h-2">Technology stack</h2></div></div>
    <div class="chips">${p.tech.map(t=>`<span class="chip" style="cursor:default"><span style="width:16px;height:16px;display:grid;place-items:center">${logoImg(t,16)}</span>${logoLabel(t)}</span>`).join('')}</div></section>`:'';

  /* ---- MEDIA (adaptive) ---- */
  const media = renderMedia();
  function renderMedia(){
    const blocks=[];
    // videos first
    if(m.videos&&m.videos.length){
      blocks.push(`<div class="section-sub"><div class="eyebrow" style="margin-bottom:10px">${ICON('film')} Videos</div>
        <div style="display:grid;gap:16px;grid-template-columns:${m.videos.length>1?'repeat(auto-fit,minmax(320px,1fr))':'1fr'}">
        ${m.videos.map((v,i)=>videoBlock(v,i)).join('')}</div></div>`);
    }
    // interactive html -> open full page in the same tab (Back returns here)
    if(m.html&&m.html.length){
      blocks.push(m.html.map(src=>`<div class="section-sub" style="margin-top:20px">
        <div class="preview-cta">
          <div class="pc-left">
            <span class="pc-ic">${ICON('code')}</span>
            <div><b>Live interactive preview</b><p class="small">Opens the full dashboard in this tab — use your browser Back button to return here.</p></div>
          </div>
          <a class="open-preview" href="${src}">Open live preview ${ICON('arrow')}</a>
        </div></div>`).join(''));
    }
    // before/after
    if(m.beforeAfter&&m.beforeAfter.before){
      blocks.push(`<div class="section-sub" style="margin-top:20px"><div class="eyebrow" style="margin-bottom:10px">${ICON('image')} Before / After</div>
        <div class="cols-2">
          <div class="gallery"><div class="shot" data-full="${m.beforeAfter.before}"><img src="${m.beforeAfter.before}" alt="Before" loading="lazy"></div></div>
          <div class="gallery"><div class="shot" data-full="${m.beforeAfter.after}"><img src="${m.beforeAfter.after}" alt="After" loading="lazy"></div></div>
        </div></div>`);
    }
    // gallery
    if(m.gallery&&m.gallery.length){
      blocks.push(`<div class="section-sub" style="margin-top:20px"><div class="eyebrow" style="margin-bottom:10px">${ICON('image')} Screenshots</div>
        <div class="gallery">${m.gallery.map(g=>`<div class="shot" data-full="${g}"><img src="${g}" alt="screenshot" loading="lazy"></div>`).join('')}</div></div>`);
    }
    // docs
    if(m.docs&&m.docs.length){
      blocks.push(`<div class="section-sub" style="margin-top:20px"><div class="eyebrow" style="margin-bottom:10px">${ICON('doc')} Documents</div>
        <div class="chips">${m.docs.map(dc=>`<a class="btn ghost" href="${dc.src}" target="_blank">${ICON('down')} ${dc.title}</a>`).join('')}</div></div>`);
    }
    const inner = blocks.length ? blocks.join('') : `<div class="placeholder-media">${ICON('film')}
      <p><b>Media ready to attach.</b></p>
      <p class="small" style="margin-top:6px">Drop videos, screenshots, an interactive HTML demo or PDFs into
      <span class="mono">projects/${p.id}/</span> and list them in <span class="mono">projects.js</span> — this section fills in automatically.</p></div>`;
    return `<section class="section" id="media">
      <div class="section-head"><div class="t"><div class="eyebrow">Showcase</div><h2 class="h-2">Media &amp; demos</h2></div></div>
      ${inner}</section>`;
  }
  function videoBlock(v,i){
    const poster = v.poster || (v.type==='youtube'?`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`:'');
    const posImg = poster?`<img src="${poster}" alt="${v.title||''}">`:'';
    return `<div class="media-video" data-type="${v.type}" data-id="${v.id||''}" data-src="${v.src||''}">
      ${posImg}<div class="play"><div class="pbtn">${ICON('play')}</div></div>
      ${v.title?`<div class="cap">${v.title}</div>`:''}</div>`;
  }

  /* ---- TIMELINE ---- */
  const timeline = (pg.timeline&&pg.timeline.length) ? `<section class="section" id="timeline">
    <div class="section-head"><div class="t"><div class="eyebrow">Development</div><h2 class="h-2">Timeline</h2></div></div>
    <div class="timeline">${pg.timeline.map(t=>`<div class="tl-item reveal"><div class="d">${t.date}</div><div class="l">${t.label}</div></div>`).join('')}</div></section>`:'';

  /* ---- NOTES : challenges + lessons ---- */
  const notes = ((pg.challenges&&pg.challenges.length)||(pg.lessons&&pg.lessons.length)) ? `<section class="section" id="notes">
    <div class="cols-2">
      ${listPanel('Challenges',pg.challenges,'route','var(--amber-400)')}
      ${listPanel('Lessons learned',pg.lessons,'book','var(--emerald-400)')}
    </div></section>`:'';

  /* ---- ROADMAP ---- */
  const roadmap = (pg.roadmap&&pg.roadmap.length) ? `<section class="section" id="roadmap">
    <div class="section-head"><div class="t"><div class="eyebrow">What’s next</div><h2 class="h-2">Future roadmap</h2></div></div>
    ${listPanel('',pg.roadmap,'sparkle','var(--violet-400)')}</section>`:'';

  function listPanel(title,items,icon,color){
    if(!items||!items.length) return '';
    return `<div class="panel" style="padding:24px">${title?`<div class="eyebrow" style="margin-bottom:12px">${title}</div>`:''}
      <ul class="list-clean">${items.map(i=>`<li><span class="mk" style="color:${color}">${ICON(icon)}</span><span>${i}</span></li>`).join('')}</ul></div>`;
  }

  /* ---- RELATED ---- */
  let related='';
  if(p.related&&p.related.length){
    const rels=p.related.map(rid=>PROJECTS.find(x=>x.id===rid)).filter(Boolean);
    if(rels.length) related=`<section class="section" id="related">
      <div class="section-head"><div class="t"><div class="eyebrow">Part of the ecosystem</div><h2 class="h-2">Related tools</h2></div></div>
      <div class="related">${rels.map(r=>`<a class="rel-card" href="tool.html?id=${r.id}">
        <div class="rc-code">${r.code} · ${STATUS[r.status].label}</div><h4>${r.name}</h4><p>${r.tagline}</p></a>`).join('')}</div></section>`;
  }

  /* ---- assemble ---- */
  mount.innerHTML = hero+efficiency+overview+problem+how+tech+media+timeline+notes+roadmap+related+
    `<footer class="foot"><a href="index.html" style="color:var(--text-2)">${ICON('back')} All Projects</a>
      <span class="tag gradient-text">Increasing Efficiency. One Tool at a Time.</span></footer>`;

  /* ---- interactions ---- */
  // animate comparison bars
  requestAnimationFrame(()=>$$('.fill').forEach(f=>{ f.style.width='0%'; requestAnimationFrame(()=>f.style.width=f.dataset.w+'%'); }));

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
