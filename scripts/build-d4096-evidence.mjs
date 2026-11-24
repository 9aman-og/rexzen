import {writeFile,readFile} from 'node:fs/promises';
import {LAYOUT,FLOOR,SCENARIOS,parseMap,inject} from '../public-research/dense-4096/d4096-gate.mjs';
const assets=new URL('../public-research/dense-4096/',import.meta.url);
const pts=parseMap(await readFile(new URL('electrode-map.csv',assets),'utf8'));
const results=Object.entries(SCENARIOS).map(([scenario,label])=>{
  const {mask,...data}=inject(pts,scenario);
  return {scenario,label,...data,weakestSector:Math.min(...data.sectors)};
});
const coverage={scope:'Deterministic software fault-injection on the modeled D4096 electrode layout. No EEG, hardware or wearer measured. This gate does not run a decoder or authorize actions.',layout:LAYOUT,thresholds:FLOOR,details:'The regional floor of 448 per sector is a provisional one-tile-loss allowance. A detected loss of the global reference or clock invalidates every sample in a window. The clustered fixture selects a contiguous patch inside one sector; the scattered fixture disables 12 deterministic addresses per sector. Real contact quality, dispersion and thresholds need dedicated validation.',results};
await writeFile(new URL('coverage-results.json',assets),JSON.stringify(coverage,null,2)+'\n');

const src=JSON.parse(await readFile(new URL('visual-study.json',assets),'utf8'));
const results5=src.results;
const graph={x0:63,x1:561,y0:223,y1:34,min:.20,max:.55};
const byY=p=>(graph.y0-(p-graph.min)/(graph.max-graph.min)*(graph.y0-graph.y1)).toFixed(2);
const byX=k=>(graph.x0+37+(graph.x1-graph.x0-70)*k/(results5.length-1)).toFixed(2);
const bar=(x,y1,y2)=>`<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="#7f91b4" stroke-width="2"/>`;
const grid=[.2,.25,.35,.45,.55].map((p)=>`<line x1="63" x2="561" y1="${byY(p)}" y2="${byY(p)}" stroke="${p===.25?'#5f7398':'#d6deea'}" ${p===.25?'stroke-dasharray="5 5"':''}/><text x="52" y="${Number(byY(p))+4}" text-anchor="end" fill="#4f5e76">${Math.round(p*100)}%</text>`).join('');
const mark=results5.map((s,i)=>{
  const x=byX(i),val=byY(s.post_median);
  return `${s.layout_repeats>1?bar(x,...s.post_range.map(byY)):''}<circle cx="${x}" cy="${val}" r="5.6" fill="#294eaf" stroke="#fcfdff" stroke-width="1.5"/><text x="${x}" y="247" text-anchor="middle" fill="#25334e">${s.eeg_channels}</text>`;
}).join('');
const draw=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="284" viewBox="0 0 600 284" role="img" aria-labelledby="title"><title id="title">Single-session balanced accuracy for 32 to 512 recorded electrodes</title><g font-family="Inter,Arial,sans-serif" font-size="14"><text x="63" y="18" fill="#46536a">Balanced accuracy (%)</text>${grid}<text x="552" y="${Number(byY(.25))-8}" text-anchor="end" fill="#46536a" font-size="12">Chance</text>${mark}<text x="313" y="272" text-anchor="middle" fill="#46536a">Recorded channels used from the same cap</text></g></svg>\n`;
await writeFile(new URL('density-evidence.svg',assets),draw);
console.log(`Generated ${results.length} coverage cases and ${results5.length} evidence points from the tracked source files.`);
