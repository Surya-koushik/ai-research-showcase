/* ============================================================================
   app.js — landing page v2 (reference-grade home)
   ============================================================================ */
(function(){
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
  const state={ cat:'all', status:'all', q:'' };

  /* ---------- Theme (light-primary) ---------- */
  const themeBtn=$('#themeBtn'), themeTop=$('#themeTop');
  function setTheme(t){
    document.documentElement.setAttribute('data-theme',t);localStorage.setItem('ads_theme',t);
    themeBtn.innerHTML=ICON(t==='dark'?'sun':'moon');
    if(themeTop)themeTop.innerHTML=ICON(t==='dark'?'sun':'moon')+`<span>${t==='dark'?'Light':'Dark'}</span>`;
    if(window.__heroReload)window.__heroReload();
  }
  setTheme(localStorage.getItem('ads_theme')||'light');
  const toggleTheme=()=>setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  themeBtn.onclick=toggleTheme; if(themeTop)themeTop.onclick=toggleTheme;

  /* ---------- static icons ---------- */
  $('#searchIc').innerHTML=ICON('search'); $('#emptyIc').innerHTML=ICON('search');
  $('#railToggle').innerHTML=ICON('menu'); $('#railToggle').onclick=()=>$('#rail').classList.toggle('open');
  $('#exIc').innerHTML=ICON('arrow'); $('#wIc').innerHTML=ICON('play'); $('#vaIc').innerHTML=ICON('arrow');
  $('#yr').textContent=new Date().getFullYear();
  const goProjects=()=>document.getElementById('projects').scrollIntoView({behavior:'smooth'});
  $('#exploreBtn').onclick=goProjects; $('#viewAll').onclick=goProjects;
  $('#watchBtn').onclick=()=>document.getElementById('featured').scrollIntoView({behavior:'smooth'});

  /* ---------- derived helpers ---------- */
  const measured=()=>PROJECTS.map(p=>({p,d:derive(p.efficiency)})).filter(x=>x.d);
  function avgEfficiency(){const m=measured();return m.length?Math.round(m.reduce((a,x)=>a+x.d.pct,0)/m.length):0;}
  function totalSaved(){return Math.round(measured().reduce((a,x)=>a+x.d.saved,0));}

  /* ---------- Rail: nav ---------- */
  function catCount(id){return id==='all'?PROJECTS.length:PROJECTS.filter(p=>p.categories.includes(id)).length;}
  function navItem(c){
    return `<a class="nav-item ${c.id===state.cat?'active':''}" data-cat="${c.id}">
      <span class="ic">${ICON(c.icon)}</span><span>${c.label}</span><span class="count">${catCount(c.id)}</span></a>`;
  }
  $('#nav').innerHTML=
    `<div class="nav-group-label">Research</div>`+
    TAXONOMY.filter(c=>['all','ai-agents','automation','dashboards','plugins','bim','experiments','research'].includes(c.id)).map(navItem).join('')+
    `<div class="nav-group-label">Domains</div>`+
    TAXONOMY.filter(c=>['revit','data','vision','llm','mcp','future'].includes(c.id)).map(navItem).join('');
  $('#nav').addEventListener('click',e=>{
    const el=e.target.closest('.nav-item'); if(!el)return;
    state.cat=el.dataset.cat; $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.cat===state.cat));
    $('#rail').classList.remove('open'); render(); goProjects();
  });

  /* ---------- Rail: efficiency + profile ---------- */
  $('#railEff').innerHTML=`<div class="rail-card">
    <div class="lbl">Overall Efficiency</div>
    <div class="big gradient-text" data-count="${avgEfficiency()}" data-suffix="%">0%</div>
    <div class="sub"><span class="dot"></span>Avg across ${measured().length} measured tools</div>
  </div>`;
  $('#railProfile').innerHTML=`<div class="profile">
    <div class="av">S</div>
    <div class="pi"><b>M Surya Koushik</b><span>AI Researcher &amp; Builder</span></div>
  </div>`;

  /* ---------- Hero art: continuous "fragments -> one" canvas + optional generated image ---------- */
  function initHeroArt(){
    const wrap=$('#heroArt'), cv=$('#fragCanvas'), img=$('#heroImg');
    if(!wrap||!cv) return;
    if(img){
      const src=()=>document.documentElement.getAttribute('data-theme')==='dark'?'assets/hero/hero-dark.png':'assets/hero/hero-light.png';
      const load=()=>{const s=src(),pr=new Image();pr.onload=()=>{img.src=s;img.hidden=false;wrap.classList.add('has-img');};pr.onerror=()=>{img.hidden=true;wrap.classList.remove('has-img');};pr.src=s;};
      window.__heroReload=load; load();
    }
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const ctx=cv.getContext('2d');
    const COL=['#7C5CFF','#8A77FF','#00D4FF','#3DE0FF','#22E6A8'];
    let W,H,DPR,parts=[],raf,t0=0;
    function resize(){DPR=Math.min(2,window.devicePixelRatio||1);const r=wrap.getBoundingClientRect();cv.width=Math.max(1,Math.round(r.width*DPR));cv.height=Math.max(1,Math.round(r.height*DPR));cv.style.width=r.width+'px';cv.style.height=r.height+'px';W=cv.width;H=cv.height;}
    function seed(){const n=Math.round(Math.min(160,Math.max(80,(W*H)/(DPR*DPR*2400))));parts=[];for(let i=0;i<n;i++)parts.push({a:(i/n)*6.283+Math.random()*0.5,rj:0.55+Math.random()*0.85,sz:(1.3+Math.random()*3)*DPR,c:COL[(Math.random()*COL.length)|0],ph:Math.random()*6.283,sw:(Math.random()*0.6+0.2)*(Math.random()<0.5?-1:1)});}
    function frame(t){if(!t0)t0=t;const el=t-t0,cx=W/2,cy=H/2,base=Math.min(W,H);
      ctx.clearRect(0,0,W,H);
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,base*0.55);
      g.addColorStop(0,'rgba(124,92,255,.18)');g.addColorStop(.55,'rgba(0,212,255,.06)');g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      const spread=0.5-0.5*Math.cos(el*0.0002),rot=el*0.00003,Rmin=base*0.05,Rmax=base*0.46;
      const pos=parts.map(p=>{const r=Rmin+(Rmax-Rmin)*spread*p.rj,ang=p.a+rot+Math.sin(el*0.0004*p.sw+p.ph)*0.15;return{x:cx+Math.cos(ang)*r,y:cy+Math.sin(ang)*r*0.82,c:p.c,sz:p.sz,tw:0.55+0.45*Math.sin(el*0.003+p.ph)};});
      ctx.globalAlpha=0.16*(1-spread);ctx.lineWidth=DPR;
      for(let i=0;i<pos.length;i++)for(let j=i+1;j<i+6&&j<pos.length;j++){const a=pos[i],b=pos[j],dx=a.x-b.x,dy=a.y-b.y;if(dx*dx+dy*dy<(64*DPR)*(64*DPR)){ctx.strokeStyle=a.c;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
      for(const q of pos){ctx.globalAlpha=0.35+0.5*q.tw;ctx.fillStyle=q.c;ctx.shadowColor=q.c;ctx.shadowBlur=7*DPR*q.tw;ctx.fillRect(q.x-q.sz/2,q.y-q.sz/2,q.sz,q.sz);}
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      if(!reduce)raf=requestAnimationFrame(frame);
    }
    function start(){resize();seed();cancelAnimationFrame(raf);t0=0;raf=requestAnimationFrame(frame);}
    start();let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(start,160);});
  }

  /* ---------- KPI strip (6, derived, honest) ---------- */
  function kpiData(){
    const prod=PROJECTS.filter(p=>p.status==='production').length;
    const exp=PROJECTS.filter(p=>p.status==='experimental').length;
    const active=PROJECTS.filter(p=>['experimental','research','in-progress'].includes(p.status)).length;
    const autom=PROJECTS.filter(p=>p.categories.includes('automation')).length;
    return [
      {v:PROJECTS.length,u:'',l:'Projects Built',ic:'layers',sub:'in the ecosystem',live:true},
      {v:totalSaved(),u:'hrs/wk',l:'Hours Saved',ic:'clock',sub:'measured tools',up:true},
      {v:autom,u:'',l:'Processes Automated',ic:'zap',sub:'workflows'},
      {v:active,u:'',l:'Active Research',ic:'flask',sub:'ongoing'},
      {v:prod,u:'',l:'Tools in Production',ic:'check',sub:'shipped'},
      {v:exp,u:'',l:'Experimental Tools',ic:'beaker',sub:'in testing'},
    ];
  }
  function renderKpis(){
    $('#kpis').innerHTML=kpiData().map(m=>`<div class="kpi2">
      <div class="top"><span class="ico">${ICON(m.ic)}</span><span class="lbl">${m.l}</span>${m.live?'<span class="live">Live</span>':''}</div>
      <div class="k-val" data-count="${m.v}">0${m.u?`<span class="u">${m.u}</span>`:''}</div>
      <div class="delta ${m.up?'':'muted'}">${m.up?ICON('spark2'):''}<span>${m.sub}</span></div>
    </div>`).join('');
  }

  /* ---------- Counters ---------- */
  function animateCounts(scope){
    (scope||document).querySelectorAll('[data-count]:not(.counted)').forEach(el=>{
      el.classList.add('counted');
      const target=+el.dataset.count, u=el.querySelector('.u')?.outerHTML||'', suf=el.dataset.suffix||'';
      const dur=1100,t0=performance.now();
      (function step(now){const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);
        el.innerHTML=Math.round(target*e)+suf+u; if(p<1)requestAnimationFrame(step);})(t0);
    });
  }

  /* ---------- Capability tri-panel ---------- */
  function renderTri(){
    const C=AI_CAPABILITY;
    const can=`<div class="pane can reveal"><h3><span class="ic">${ICON('check')}</span>${C.can.title}</h3>
      <div class="can-grid">${C.can.items.map(i=>`<div class="cap-chip"><span class="mk">${ICON('check')}</span>${i}</div>`).join('')}</div>
      <div class="pfoot">${C.can.footer}</div></div>`;
    const cant=`<div class="pane cant reveal"><h3><span class="ic">${ICON('x')}</span>${C.cant.title}</h3>
      <ul class="cant-list">${C.cant.items.map(i=>`<li><span class="mk">${ICON('x')}</span><span>${i}</span></li>`).join('')}</ul>
      <div class="pfoot">${C.cant.footer}</div></div>`;
    const rnd=`<div class="pane rnd reveal"><h3><span class="ic">${ICON('flask')}</span>${C.rnd.title}</h3>
      <ul class="rnd-list">${C.rnd.items.map(i=>`<li><span>${i}</span><span class="rnd-badge">IN R&amp;D</span></li>`).join('')}</ul>
      <div class="rnd-more">${C.rnd.footer}<span>${ICON('arrow')}</span></div></div>`;
    $('#tri').innerHTML=can+cant+rnd;
  }

  /* ---------- Featured row ---------- */
  const CAT_LABEL={dashboards:'Dashboard','ai-agents':'AI Agent',automation:'Automation',plugins:'Plugin',bim:'BIM',revit:'Revit',research:'Research',vision:'Vision AI',mcp:'MCP',llm:'LLM',data:'Data'};
  function primaryCat(p){for(const c of p.categories){if(CAT_LABEL[c])return CAT_LABEL[c];}return 'Tool';}
  function featuredList(){
    const withEff=measured().sort((a,b)=>b.d.pct-a.d.pct).map(x=>x.p);
    const rest=PROJECTS.filter(p=>!withEff.includes(p));
    return [...withEff,...rest].slice(0,5);
  }
  function featCard(p){
    const d=derive(p.efficiency);
    const hero=p.media&&p.media.hero
      ? `<img src="${p.media.hero}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="ph" style="display:none">${ICON('image')}</div>`
      : `<div class="ph">${ICON('image')}</div>`;
    const pct=d?`<span class="pct">+${d.pct}% <span style="font-size:11px;color:var(--text-3);font-weight:500">efficiency</span></span>`
               :`<span class="pct na">Impact TBD</span>`;
    const techs=(p.tech||[]).slice(0,4).map(t=>`<span class="tl" title="${logoLabel(t)}">${logoImg(t,14)}</span>`).join('');
    return `<a class="feat-card" href="tool.html?id=${p.id}">
      <div class="fp">${hero}<div class="glow"></div>
        <span class="catpill">${primaryCat(p)}</span><span class="code">${p.code}</span></div>
      <div class="fb">
        <h4>${p.name}</h4><p class="fd">${p.tagline}</p>
        <div class="feff">${pct}<div class="tech-row">${techs}</div></div>
      </div></a>`;
  }
  function renderFeatured(){ $('#featRow').innerHTML=featuredList().map(featCard).join(''); }

  /* ---------- Status filter ---------- */
  const STATUS_ORDER=['all','production','in-progress','experimental','research'];
  $('#statusFilter').innerHTML=STATUS_ORDER.map(s=>{
    const meta=s==='all'?{label:'All',cls:''}:STATUS[s];
    const dot=s==='all'?'':`<span class="dot ${meta.cls}"></span>`;
    return `<button class="chip ${s===state.status?'active':''}" data-status="${s}">${dot}${meta.label}</button>`;
  }).join('');
  $('#statusFilter').addEventListener('click',e=>{const c=e.target.closest('.chip'); if(!c)return;
    state.status=c.dataset.status; $$('#statusFilter .chip').forEach(x=>x.classList.toggle('active',x.dataset.status===state.status)); render();});

  /* ---------- Search ---------- */
  const search=$('#search');
  search.addEventListener('input',()=>{state.q=search.value.trim().toLowerCase();render();});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement!==search){e.preventDefault();search.focus();}});

  /* ---------- Full grid cards ---------- */
  function match(p){
    if(state.cat!=='all'&&!p.categories.includes(state.cat))return false;
    if(state.status!=='all'&&p.status!==state.status)return false;
    if(state.q){const hay=[p.name,p.code,p.tagline,p.description,p.workflowStage,(p.tech||[]).map(logoLabel).join(' '),p.categories.join(' '),p.status].join(' ').toLowerCase();
      if(!hay.includes(state.q))return false;}
    return true;
  }
  function card(p){
    const d=derive(p.efficiency), st=STATUS[p.status];
    const techs=(p.tech||[]).slice(0,5).map(t=>`<span class="tl" title="${logoLabel(t)}">${logoImg(t,15)}</span>`).join('')
      +((p.tech||[]).length>5?`<span class="more">+${p.tech.length-5}</span>`:'');
    const hero=p.media&&p.media.hero
      ? `<img src="${p.media.hero}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="ph" style="display:none">${ICON('image')}</div>`
      : `<div class="ph">${ICON('image')}</div>`;
    const eff=d
      ? `<div class="eff"><div><div class="big gradient-text">${d.saved}<span style="font-size:12px;color:var(--text-3)"> hrs/wk</span></div>
           <div class="lbl">saved · ${d.speed?d.speed+'× faster':'—'} · ${d.pct}% efficiency</div></div><span class="arrow">${ICON('arrow')}</span></div>`
      : `<div class="eff"><div><div class="big" style="color:var(--text-3);font-size:14px">Impact to be measured</div>
           <div class="lbl">time-saving not yet quantified</div></div><span class="arrow">${ICON('arrow')}</span></div>`;
    return `<a class="tool-card reveal" href="tool.html?id=${p.id}">
      <div class="preview">${hero}<div class="glow"></div>
        <div class="toprow"><span class="badge code">${p.code}</span>
          <span class="badge"><span class="dot ${st.cls}"></span>${st.label}${d&&d.draft?' · DRAFT':''}</span></div></div>
      <div class="body">
        <div class="title-row"><div class="logo-badge">${logoImg(p.logo,18)}</div><h3>${p.name}</h3></div>
        <div class="tech-row">${techs}</div>
        <p class="desc">${p.tagline}</p>
        <div class="meta"><span class="badge" style="font-size:10.5px">${p.workflowStage}</span></div>
        ${eff}</div></a>`;
  }
  function render(){
    const list=PROJECTS.filter(match);
    $('#tools').innerHTML=list.map(card).join('');
    $('#emptyState').style.display=list.length?'none':'block';
    observeReveals(); animateCounts($('#tools'));
  }

  /* ---------- Reveal ---------- */
  let io;
  function observeReveals(){
    if(!io)io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
    $$('.reveal:not(.in)').forEach(el=>io.observe(el));
  }

  /* ---------- Init ---------- */
  const FLOW=[
    {ic:'book',t:'Information',s:'Drawings, documents, BIM models & site data'},
    {ic:'gauge',t:'Analysis',s:'AI reads, extracts, validates & classifies'},
    {ic:'layers',t:'Structured knowledge',s:'Clean records, quantities, audits, reports'},
    {ic:'grid',t:'Tools',s:'Plugins, MCP bridges, dashboards, automations'},
    {ic:'sparkle',t:'Measurable impact',s:'Hours saved, fewer errors, faster delivery'}
  ];
  function renderFlow(){ const el=$('#flowSteps'); if(!el)return;
    el.innerHTML=FLOW.map((f,i)=>`<div class="flow-step${i===FLOW.length-1?' accent':''}">
      <div class="fs-ic">${ICON(f.ic)}</div>
      <div class="fs-t">${f.t}</div><div class="fs-s">${f.s}</div>
      ${i<FLOW.length-1?`<span class="fs-arrow">${ICON('arrow')}</span>`:''}
    </div>`).join('');
  }
  renderKpis(); renderFlow(); renderTri(); renderFeatured(); render();
  animateCounts(); observeReveals();
})();
