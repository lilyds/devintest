/* AE Targets dashboard — loads ae_data.json, computes live MTD/pacing from a simulated
   daily curve (built from each account's 4 April weekly buckets; full-month totals exact). */
let DATA = null, ASOF = 5, SORT = {key:'pacing', dir:-1}, PLAY = null;
const TODAY = 20;                     // April 20, 2026 — no actuals beyond this; slider/play cap here
let EDITS = {}, DIRTY = false;       // pending ACU-target edits on the detail page
const OV_KEY = 'ae_target_overrides';

const fmtACU = n => n == null ? '—' : Math.round(n).toLocaleString('en-US');
const fmtUSD = n => n == null ? '—' : '$' + Math.round(n).toLocaleString('en-US');
const fmtPrice = n => n == null ? '—' : '$' + n.toFixed(2);
const goalClass = p => p==null ? 'g-na' : (p>=100?'g-green':(p>=85?'g-amber':'g-red'));
const barClass  = p => p>=100?'b-green':(p>=85?'b-amber':'b-red');
const pctTxt = p => p==null ? '—' : (p>=1000 ? '999%+' : Math.round(p)+'%');

// Build a 30-day curve from 4 weekly ACU buckets, scaled so the month sum is exact.
function dailyCurve(weeks){
  const DIM = DATA.meta.days_in_month;
  const rates = weeks.map(w=>w/7.0);          // weekly daily-rates
  const anchors = [0,1/3,2/3,1.0];            // place 4 rates across the month
  const day=[];
  for(let i=0;i<DIM;i++){
    const p = i/(DIM-1);
    let r=rates[3];
    for(let s=0;s<3;s++){
      if(p<=anchors[s+1]||s===2){
        const t=(p-anchors[s])/(anchors[s+1]-anchors[s]);
        r=rates[s]+(rates[s+1]-rates[s])*t; break;
      }
    }
    day.push(Math.max(r,0));
  }
  const tot=weeks.reduce((a,b)=>a+b,0), ssum=day.reduce((a,b)=>a+b,0);
  return ssum>0 ? day.map(x=>x*tot/ssum) : day;
}
function mtdPace(weeks, asof){
  const DIM = DATA.meta.days_in_month;
  const day = dailyCurve(weeks);
  let mtd=0; for(let i=0;i<asof;i++) mtd+=day[i];
  return {mtd, pace: asof? mtd/asof*DIM : 0};
}
// Per-account live metrics at the current asof
function acctMetrics(a){
  const {mtd, pace} = mtdPace(a.weeks, ASOF);
  const goal = a.target>0 ? pace/a.target*100 : null;
  return {mtd, pace, goal, revMtd: mtd*a.price, lastMonth:a.march, target:a.target, price:a.price};
}
function aggregate(accts){
  let march=0,mtd=0,pace=0,target=0,revMtd=0,aprAcu=0,priceNum=0;
  accts.forEach(a=>{
    const m=acctMetrics(a);
    march+=a.march; mtd+=m.mtd; pace+=m.pace; target+=a.target; revMtd+=m.revMtd;
    const ap=a.weeks.reduce((x,y)=>x+y,0); aprAcu+=ap; priceNum+=ap*a.price;
  });
  return {march,mtd,pace,target,revMtd,
          price: aprAcu>0?priceNum/aprAcu:null,
          goal: target>0?pace/target*100:null};
}

function bar(p){
  if(p==null) return '<div class="bar"><div class="bar-na">no target</div></div>';
  const w=Math.max(2,Math.min(100,p));
  return `<div class="bar"><div class="bar-fill ${barClass(p)}" style="width:${w}%"></div></div>`;
}
function pill(p){ return `<span class="pill ${goalClass(p)}">${pctTxt(p)}</span>`; }

/* ---------------- ROSTER ---------------- */
function aeList(){
  const groups={};
  DATA.accounts.forEach(a=>{ (groups[a.ae]=groups[a.ae]||[]).push(a); });
  return Object.keys(groups).sort((a,b)=>+a.slice(2)-+b.slice(2))
    .map(ae=>({ae, n:groups[ae].length, ...aggregate(groups[ae])}));
}
function renderRoster(){
  const tb=document.getElementById('roster-body'); if(!tb) return;
  let rows=aeList();
  const k=SORT.key;
  rows.sort((a,b)=> (a[k]==null?-1:b[k]==null?1:(a[k]-b[k]))*SORT.dir || (a.ae<b.ae?-1:1));
  let html='';
  rows.forEach(r=>{
    html+=`<tr class="ae-row">
      <td class="c-name"><button class="ae-btn" onclick="openAE('${r.ae}')" title="Open ${r.ae}'s account book">${r.ae}</button> <span class="muted">· ${r.n} accts</span></td>
      <td class="num">${fmtACU(r.march)}</td>
      <td class="num">${fmtACU(r.mtd)}</td>
      <td class="num strong">${fmtACU(r.pace)}</td>
      <td class="num">${fmtACU(r.target)}</td>
      <td class="num">${pill(r.goal)}</td>
      <td class="num">${fmtPrice(r.price)}</td>
      <td class="num">${fmtUSD(r.revMtd)}</td>
      <td class="c-bar">${bar(r.goal)}</td>
    </tr>`;
  });
  const t=aggregate(DATA.accounts);
  html+=`<tr class="total-row">
      <td class="c-name">TOTAL <span class="muted">· ${DATA.accounts.length} accts</span></td>
      <td class="num">${fmtACU(t.march)}</td>
      <td class="num">${fmtACU(t.mtd)}</td>
      <td class="num strong">${fmtACU(t.pace)}</td>
      <td class="num">${fmtACU(t.target)}</td>
      <td class="num">${pill(t.goal)}</td>
      <td class="num">${fmtPrice(t.price)}</td>
      <td class="num">${fmtUSD(t.revMtd)}</td>
      <td class="c-bar">${bar(t.goal)}</td>
    </tr>`;
  tb.innerHTML=html;
  updateKPIs(t);
  markSortHeaders();
}
function updateKPIs(t){
  const set=(id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
  set('kpi-pace', fmtACU(t.pace));
  set('kpi-target', fmtACU(t.target));
  set('kpi-goal', pctTxt(t.goal));
  set('kpi-rev', fmtUSD(t.revMtd));
  const g=document.getElementById('kpi-goal'); if(g){ g.className='k-val'; g.style.color =
    t.goal>=100?'var(--green)':t.goal>=85?'var(--amber)':'var(--red)'; }
}
function markSortHeaders(){
  document.querySelectorAll('th[data-key]').forEach(th=>{
    const a=th.querySelector('.arr'); if(a) a.remove();
    if(th.dataset.key===SORT.key){
      const s=document.createElement('span'); s.className='arr';
      s.textContent = SORT.dir<0?' ▼':' ▲'; th.appendChild(s);
    }
  });
}
function openAE(ae){ location.href='ae-detail.html?ae='+ae; }

/* ---------------- editable ACU targets (detail page) ---------------- */
function applyOverrides(){
  let ov={}; try{ ov=JSON.parse(localStorage.getItem(OV_KEY)||'{}'); }catch(e){}
  DATA.accounts.forEach(a=>{ if(ov[a.id]!=null) a.target=ov[a.id]; });
}
function startEditTarget(td){
  if(td.querySelector('input')) return;
  const id=td.dataset.id, a=DATA.accounts.find(x=>x.id===id); if(!a) return;
  const prev=a.target;
  td.innerHTML=`<input class="target-input" type="number" min="0" step="1" value="${Math.round(a.target)}"/>`;
  const inp=td.querySelector('input'); inp.focus(); inp.select();
  let done=false;
  const ae=new URLSearchParams(location.search).get('ae');
  const commit=()=>{ if(done) return; done=true;
    let v=parseFloat(inp.value); if(isNaN(v)||v<0) v=0; v=Math.round(v);
    if(v!==Math.round(prev)){ a.target=v; EDITS[id]=v; DIRTY=true; }
    renderDetail(ae); updateSaveBtn();
  };
  const cancel=()=>{ if(done) return; done=true; renderDetail(ae); };
  inp.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ e.preventDefault(); inp.blur(); }
    else if(e.key==='Escape'){ e.preventDefault(); cancel(); }
  });
  inp.addEventListener('blur',commit);
  inp.addEventListener('click',e=>e.stopPropagation());
}
function updateSaveBtn(){
  const b=document.getElementById('save-btn'); if(!b) return;
  b.style.display = DIRTY ? 'inline-block' : 'none';
  b.textContent='Save'; b.disabled=false;
}
function saveEdits(){
  let ov={}; try{ ov=JSON.parse(localStorage.getItem(OV_KEY)||'{}'); }catch(e){}
  Object.assign(ov, EDITS);
  localStorage.setItem(OV_KEY, JSON.stringify(ov));
  EDITS={}; DIRTY=false;
  const b=document.getElementById('save-btn');
  if(b){ b.textContent='Saved ✓'; b.disabled=true; setTimeout(()=>{ if(!DIRTY) b.style.display='none'; }, 1400); }
}

/* ---------------- DETAIL ---------------- */
const PHASE_ORDER=['Demo','POC','UAT','Production','Internal','Archived','Unknown'];
function renderDetail(ae){
  const tb=document.getElementById('detail-body'); if(!tb) return;
  const accts=DATA.accounts.filter(a=>a.ae===ae);
  document.getElementById('ae-name').textContent = ae+' — Account Book';
  document.getElementById('ae-count').textContent = accts.length+' accounts';
  document.getElementById('crumb-ae').textContent = ae;
  const byPhase={}; accts.forEach(a=>{ (byPhase[a.phase]=byPhase[a.phase]||[]).push(a); });
  let html='';
  PHASE_ORDER.forEach(ph=>{
    const list=byPhase[ph]; if(!list||!list.length) return;
    list.sort((a,b)=> b.march-a.march);           // within phase: last-month ACU DESC
    const sub=aggregate(list);
    const stretch=DATA.meta.stretch[ph];
    html+=`<tr class="grp-row">
      <td class="c-name" colspan="2">■ ${ph.toUpperCase()} <span class="muted">· ${list.length} accts · stretch ${stretch.toFixed(2)}×</span></td>
      <td class="num">${fmtACU(sub.march)}</td>
      <td class="num">${fmtACU(sub.mtd)}</td>
      <td class="num strong">${fmtACU(sub.pace)}</td>
      <td class="num">${fmtACU(sub.target)}</td>
      <td class="num">${pill(sub.goal)}</td>
      <td class="num">${fmtPrice(sub.price)}</td>
      <td class="num">${fmtUSD(sub.revMtd)}</td></tr>`;
    list.forEach(a=>{
      const m=acctMetrics(a);
      const label=a.id.replace('enterprise-','ent-').slice(0,18)+'…';
      html+=`<tr class="acct-row" title="${a.id}">
        <td class="c-acct" colspan="2">${label}</td>
        <td class="num">${fmtACU(a.march)}</td>
        <td class="num">${fmtACU(m.mtd)}</td>
        <td class="num strong">${fmtACU(m.pace)}</td>
        <td class="num c-target" data-id="${a.id}" onclick="startEditTarget(this)" title="Click to edit ACU target">${fmtACU(a.target)}</td>
        <td class="num">${pill(m.goal)}</td>
        <td class="num">${fmtPrice(a.price)}</td>
        <td class="num">${fmtUSD(m.revMtd)}</td></tr>`;
    });
  });
  tb.innerHTML=html;
}

/* ---------------- shared controls ---------------- */
function setAsof(v){
  ASOF=Math.max(1, Math.min(+v, TODAY));
  let lab='April '+ASOF+', 2026';
  if(ASOF===TODAY) lab+=' · today';
  const e=document.getElementById('asof-label'); if(e) e.textContent=lab;
  const s=document.getElementById('asof'); if(s) s.value=ASOF;
  const ae=new URLSearchParams(location.search).get('ae');
  if(ae) renderDetail(ae); else renderRoster();
}
function togglePlay(){
  const btn=document.getElementById('play-btn');
  if(PLAY){ clearInterval(PLAY); PLAY=null; if(btn) btn.textContent='▶'; return; }
  if(ASOF>=TODAY) ASOF=1;
  if(btn) btn.textContent='⏸';
  PLAY=setInterval(()=>{ if(ASOF>=TODAY){ clearInterval(PLAY); PLAY=null; if(btn) btn.textContent='▶'; return;} setAsof(ASOF+1); },450);
}
function initControls(){
  const s=document.getElementById('asof');
  if(s){ s.value=ASOF; s.addEventListener('input',()=>setAsof(s.value)); }
  const b=document.getElementById('play-btn'); if(b) b.addEventListener('click',togglePlay);
  const sv=document.getElementById('save-btn'); if(sv) sv.addEventListener('click',saveEdits);
  document.querySelectorAll('th[data-key]').forEach(th=>{
    th.addEventListener('click',()=>{
      const k=th.dataset.key;
      if(SORT.key===k) SORT.dir*=-1; else {SORT.key=k; SORT.dir=-1;}
      renderRoster();
    });
  });
}
async function init(){
  DATA = await (await fetch('ae_data.json')).json();
  ASOF = TODAY;
  applyOverrides();
  initControls();
  const ae=new URLSearchParams(location.search).get('ae');
  if(ae) renderDetail(ae); else renderRoster();
  setAsof(ASOF);
}
document.addEventListener('DOMContentLoaded', init);
