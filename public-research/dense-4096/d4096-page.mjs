import {parseMap,inject,LAYOUT} from './d4096-gate.mjs';

const stage=document.querySelector('#model-stage');
const control=document.querySelector('#view-controls');
const select=document.querySelector('#scenario');
const root=document.querySelector('#simulation');
const label=document.querySelector('#render-status');
const coverageCanvas=document.querySelector('#coverage-map');
const output=(id,value)=>{document.getElementById(id).textContent=value;};
const fmt=new Intl.NumberFormat('en-US');
const text={qualified:'Within modeled thresholds','global-count':'Withheld: total coverage','regional-count':'Withheld: sector coverage',reference:'Withheld: reference lost',clock:'Withheld: clock lost'};
let viewer, points, plane;
function acquireCoverageContext(){
  try{return coverageCanvas.getContext('2d');}catch{return null;}
}
const coverageContext=acquireCoverageContext();
function drawCoverage(current){
  const ctx=coverageContext;
  if(!ctx)return;
  ctx.clearRect(0,0,256,256);
  ctx.strokeStyle='#7691bd';ctx.lineWidth=1.25;ctx.beginPath();ctx.arc(128,128,115,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#3f4e68';ctx.beginPath();ctx.moveTo(13,128);ctx.lineTo(243,128);ctx.moveTo(128,13);ctx.lineTo(128,243);ctx.stroke();
  for(const [rejected,color,size] of [[false,'#98b3e5',1.6],[true,'#ffb092',2.4]]){
    ctx.fillStyle=color;
    for(const [id,x,y] of plane) if(current.mask[id]===rejected) ctx.fillRect(x-size/2,y-size/2,size,size);
  }
  coverageCanvas.setAttribute('aria-label',`Electrode map: ${fmt.format(LAYOUT.total-current.valid)} of ${fmt.format(LAYOUT.total)} positions are rejected`);
  coverageCanvas.closest('figure').hidden=false;
}
function staticView(){
  viewer=undefined;stage.dataset.renderer='static';control.hidden=true;label.textContent='Static view · 3D unavailable';
}
function mode(name){
  if(!viewer)return;
  stage.dataset.view=name;viewer.setMode(name);
  for(const btn of control.querySelectorAll('[data-view]'))btn.setAttribute('aria-pressed',String(btn.dataset.view===name));
}
function showScenario(orient){
  const current=inject(points,select.value);
  root.dataset.gate=current.reason;
  output('sim-present',fmt.format(current.present));output('sim-valid',fmt.format(current.valid));
  output('sim-sector',`${Math.min(...current.sectors)} / ${LAYOUT.sectorSize}`);
  output('sim-result',text[current.reason]);
  output('sim-summary',`${fmt.format(current.valid)} usable of ${fmt.format(current.present)} present.`);
  for(const el of root.querySelectorAll('[data-sector]')){
    const idx=Number(el.dataset.sector),n=current.sectors[idx];el.style.setProperty('--fraction',`${n/LAYOUT.sectorSize*100}%`);
    el.title=`Sector ${idx+1}: ${n} of ${LAYOUT.sectorSize} usable`;
    el.setAttribute('aria-label',el.title);el.dataset.loss=String(n<LAYOUT.sectorSize);
  }
  drawCoverage(current);
  if(orient&&viewer&&stage.dataset.view==='shell')mode('array');
  if(viewer)viewer.setFault(current.mask,orient);
}

async function load(){
  // Start the bytes and the WebGL code in parallel. A renderer error must not disable the numerical workbench.
  const webgl=import('./d4096-viewer.mjs').catch(()=>null);
  try{
    const res=await fetch(new URL('electrode-map.csv',import.meta.url));
    if(!res.ok)throw new Error('Electrode map unavailable');
    points=parseMap(await res.text());
    const extent=Math.max(...points.map(({u,w})=>Math.hypot(u,w)));
    plane=points.map(({id,u,w})=>[id,128+114*u/extent,128-114*w/extent]);
    showScenario(false);
    select.addEventListener('change',()=>showScenario(true));
    select.disabled=false;root.dataset.ready='true';
  }catch{
    select.disabled=true;root.dataset.ready='false';
    output('sim-result','Workbench unavailable');output('sim-summary','Open the static scenario results below.');staticView();return;
  }
  const lib=await webgl;
  if(!lib){staticView();return;}
  try{
    viewer=lib.createViewer(stage,points,staticView);
    stage.dataset.renderer='3d';control.hidden=false;label.textContent='Drag to rotate · use buttons to change view';
    for(const btn of control.querySelectorAll('[data-view]'))btn.addEventListener('click',()=>mode(btn.dataset.view));
    for(const btn of control.querySelectorAll('[data-camera]'))btn.addEventListener('click',()=>{
      if(!viewer)return;
      const n=btn.dataset.camera;
      if(n==='top')viewer.top();else if(n==='reset')viewer.reset();else viewer.rotate(n==='left'?-1:1);
    });
    showScenario(false);
  }catch{staticView();}
}
load();
