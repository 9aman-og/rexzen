// Research simulation. No EEG, decoder, medical or hardware interface.
export const LAYOUT = Object.freeze({total:4096, sectors:8, sectorSize:512, tiles:64, tileSize:64});
export const FLOOR = Object.freeze({global:4000, regional:448});
export const SCENARIOS = Object.freeze({
  clean: 'Intact array',
  'one-tile': 'One tile lost',
  'two-tiles': 'Two tiles lost',
  scattered: '96 scattered contacts',
  clustered: '96 clustered contacts',
  reference: 'Reference lost',
  clock: 'Clock lost',
});
const HEADER = 'address,sector,tile_in_sector,tile,lane,x_mm,y_mm,z_mm,lambert_x_mm,lambert_y_mm';
const {total,sectors,sectorSize,tileSize}=LAYOUT;
const RADIUS_MM=96;

export function parseMap(csv){
  const lines=csv.trim().split(/\r?\n/);
  if(lines.shift()!==HEADER || lines.length!==total) throw new Error('Unexpected electrode map schema or size');
  const seen=new Set();
  return lines.map((line,id)=>{
    const cols=line.split(',');
    const v=cols.map(Number);
    const [address,sector,slot,tile,lane,x,y,z,u,w]=v;
    if(cols.length!==10 || cols.some(s=>s.trim()==='') || v.some(x=>!Number.isFinite(x)) || address!==id) throw new Error('Invalid address or coordinate in electrode map');
    if(sector!==Math.floor(id/sectorSize) || tile!==Math.floor(id/tileSize) || slot!==tile%8 || lane!==id%tileSize) throw new Error('Invalid electrode map layout');
    const key=`${x}:${y}:${z}`;
    if(seen.has(key) || Math.abs(Math.hypot(x,y,z)-RADIUS_MM)>0.25 || z<=0) throw new Error('Invalid electrode map coordinates');
    const f=Math.sqrt(2/(1+z/RADIUS_MM));
    if(Math.hypot(u-f*x,w-f*y)>.01) throw new Error('Invalid electrode map projection');
    seen.add(key);return {id,sector,tile,lane,x,y,z,u,w};
  });
}

function nearby(points){
  // Select a coherent patch inside one sector around its 3D mean. This is a
  // scripted contact-quality stress case, not a model of human impedance.
  const roi=points.slice(sectorSize*4,sectorSize*5);
  const mean=roi.reduce((s,p)=>[s[0]+p.x,s[1]+p.y,s[2]+p.z],[0,0,0]).map(v=>v/sectorSize);
  const ranked=roi.map(p=>({id:p.id,r:(p.x-mean[0])**2+(p.y-mean[1])**2+(p.z-mean[2])**2}));
  return ranked.sort((a,b)=>a.r-b.r||a.id-b.id).slice(0,96).map(p=>p.id);
}

export function inject(points, scenario){
  if(!Object.hasOwn(SCENARIOS,scenario)) throw new Error('Unrecognized fault scenario');
  const mask=new Array(total).fill(false);
  let present=total;
  if(scenario==='one-tile'||scenario==='two-tiles'){
    for(const tile of scenario==='one-tile'?[36]:[36,37]){
      mask.fill(true,tile*tileSize,(tile+1)*tileSize);present-=tileSize;
    }
  }
  if(scenario==='scattered') for(let s=0;s<sectors;s++) for(let k=0;k<12;k++) mask[s*sectorSize+(23+s*13+k*37)%sectorSize]=true;
  if(scenario==='clustered') for(const id of nearby(points)) mask[id]=true;
  const critical=scenario==='reference'||scenario==='clock';
  if(critical) mask.fill(true);
  const counts=Array.from({length:sectors},(_,s)=>mask.slice(s*sectorSize,(s+1)*sectorSize).filter(v=>!v).length);
  const valid=counts.reduce((sum,v)=>sum+v,0);
  const reason=critical?scenario:valid<FLOOR.global?'global-count':Math.min(...counts)<FLOOR.regional?'regional-count':'qualified';
  return {present,valid,mask,sectors:counts,reason};
}
