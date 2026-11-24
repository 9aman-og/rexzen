import * as THREE from './three.module.min.js';

// Presentation geometry. Only the electrode centers come from the published coordinate manifest.
const R=96;
const TAU=2*Math.PI;
const clamp=THREE.MathUtils.clamp;
const colors=['#c7dafc','#8caef5','#90a9d1','#b4d6ff','#99bcff','#bac9ea','#729be7','#adc2de'];
const cold=colors.map(x=>new THREE.Color(x));
const amber=new THREE.Color('#ff986b');
const initialYaw=-.82, initialTilt=.65;
const polar=(r,t,a)=>new THREE.Vector3(r*Math.sin(t)*Math.sin(a),r*Math.cos(t),r*Math.sin(t)*Math.cos(a));

function steel(color,roughness=.48,metalness=.29){return new THREE.MeshStandardMaterial({color,roughness,metalness,side:THREE.DoubleSide});}
function skin(radius,edge,material){
  const p=[],uv=[],index=[];
  const rows=54, cols=144;
  for(let j=0;j<=rows;j++) for(let i=0;i<=cols;i++){
    const a=i/cols*TAU;
    const v=polar(radius,.0003+(edge(a)-.0003)*j/rows,a);
    p.push(v.x,v.y,v.z);uv.push(i/cols,j/rows);
    if(j<rows&&i<cols){const n=j*(cols+1)+i;index.push(n,n+cols+1,n+1,n+1,n+cols+1,n+cols+2);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();
  // Correct normals if the vertex convention is adapted later.
  const saved=g.attributes.normal;
  if(saved.getY(Math.floor(cols/2)+(cols+1)*10)<0){
    for(let i=0;i<index.length;i+=3)[index[i+1],index[i+2]]=[index[i+2],index[i+1]];
    g.setIndex(index);g.computeVertexNormals();
  }
  return new THREE.Mesh(g,material);
}
function curve(points, thickness, material, closed=false){
  const line = new THREE.CatmullRomCurve3(points,closed);
  return new THREE.Mesh(new THREE.TubeGeometry(line,points.length,thickness,5,closed),material);
}
function sampled(n,fn){return Array.from({length:n},(_,i)=>fn(i/(n-1)));}
function ring(r,theta,width,material){return curve(sampled(127,u=>polar(r,theta,TAU*u*126/127)),width,material,true);}
function chamfered(w,h,d,material){
  const s=new THREE.Shape();const x=w/2,y=h/2,k=Math.min(w,h)*.16;
  s.moveTo(-x+k,-y);s.lineTo(x-k,-y);s.quadraticCurveTo(x,-y,x,-y+k);s.lineTo(x,y-k);s.quadraticCurveTo(x,y,x-k,y);s.lineTo(-x+k,y);s.quadraticCurveTo(-x,y,-x,y-k);s.lineTo(-x,-y+k);s.quadraticCurveTo(-x,-y,-x+k,-y);
  const g=new THREE.ExtrudeGeometry(s,{depth:d,curveSegments:5,steps:1,bevelEnabled:false});g.translate(0,0,-d/2);return new THREE.Mesh(g,material);
}
function weave(){
  // An original tileable fine cross-weave; generated without network resources.
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#737986';ctx.fillRect(0,0,128,128);
  for(let i=0;i<128;i+=4){ctx.fillStyle=i%8===0?'#a8b1c1':'#8e97a6';ctx.fillRect(i,0,1,128);ctx.fillStyle=i%8===0?'#565d6a':'#626a79';ctx.fillRect(0,i,128,1);}
  const t=new THREE.CanvasTexture(canvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(10,5);return t;
}
function visor(material){
  const steps=74,p=[],uv=[],i=[];
  for(let j=0;j<=1;j++)for(let k=0;k<=steps;k++){
    const u=k/steps,a=(u-.5)*2.24;
    const reach=Math.sin(u*Math.PI)**1.3;
    const r=1.022+j*.34*reach;
    p.push(Math.sin(a)*r,.012-.06*j*reach,Math.cos(a)*r);uv.push(u,j);
    if(j===0&&k<steps){let a0=k,b=k+steps+1;i.push(a0,b,a0+1,a0+1,b,b+1);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(i);g.computeVertexNormals();
  const arch=curve(sampled(75,u=>{const a=(u-.5)*2.24,k=Math.sin(u*Math.PI)**1.3;return new THREE.Vector3(Math.sin(a)*(1.022+.34*k),.012-.06*k,Math.cos(a)*(1.022+.34*k));}),.011,steel('#57617a',.52,.27));
  const v=new THREE.Group();v.add(new THREE.Mesh(g,material),arch);return v;
}

export function createViewer(stage, points, fail){
  const THREErender = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  THREErender.setPixelRatio(Math.min(devicePixelRatio||1,2));
  THREErender.toneMapping=THREE.ACESFilmicToneMapping;
  THREErender.toneMappingExposure=1.24;
  const canvas=THREErender.domElement; canvas.className='gl-canvas'; canvas.dataset.count=String(points.length);canvas.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(); const camera=new THREE.OrthographicCamera(-1,1,1,-1,.05,20);
  scene.add(new THREE.HemisphereLight('#d7e6ff','#424856',1.85));
  for(const [c,i,x,y,z] of [['#d9e9ff',3.15,-3,5,4],['#96b5f5',2.4,2,2,-3],['#a1b9e1',.9,1,-2,4]]){
    const light=new THREE.DirectionalLight(c,i);light.position.set(x,y,z);scene.add(light);
  }
  const liner=new THREE.Group(); const cover=new THREE.Group(); const trim=new THREE.Group();
  scene.add(liner,cover,trim);
  const capEdge=Math.acos(Math.min(...points.map(p=>p.z))/R)+.01;
  liner.add(skin(.986,()=>capEdge,steel('#242d40',.61,.41)));
  const etch=steel('#555f76',.58,.44);const slip=steel('#2b3950',.56,.44);
  for(const v of [.29,.56,.87,1.13,1.33]) liner.add(ring(.989,v,.002,slip));
  liner.add(ring(1.012,capEdge-.008,.013,etch),ring(1.026,1.534,.017,steel('#111824',.47,.2)));
  for(let j=0;j<8;j++){
    const ph=j*TAU/8;
    liner.add(curve(sampled(53,u=>polar(.991,.08+u*1.45,ph)),.003,etch));
  }

  const material=steel('#333c4d',.87,.21);material.bumpMap=weave();material.bumpScale=.018;
  const coverEdge=a=>1.553+.078*(1-Math.cos(a))*.5;
  cover.add(skin(1.048,coverEdge,material));
  const stitch=steel('#5d687e',.8,.16);
  cover.add(curve(sampled(134,u=>polar(1.049,coverEdge(u*TAU),u*TAU)),.012,steel('#1e2430',.85,.14),true));
  for(const a of [-2.65,-1.62,-.71,.71,1.62,2.65]){
    cover.add(curve(sampled(57,u=>polar(1.05,.12+u*1.406,a)),.003,stitch));
  }
  trim.add(visor(steel('#283345',.81,.16)));
  trim.add(ring(1.024,1.595,.019,steel('#111722',.5,.29)));
  const pods=new THREE.Group(); trim.add(pods);
  for(const a of [1.65,-1.65,2.95]){
    const g=new THREE.Group();g.position.set(Math.sin(a)*1.009,-.06,Math.cos(a)*1.009);g.rotation.y=a;pods.add(g);
    g.add(chamfered(a===2.95?.41:.23,.122,.10,steel('#333e51',.55,.32)));
    const plate=chamfered(a===2.95?.29:.157,.047,.018,steel('#222c3a',.45,.24));plate.position.set(0,0,.054);g.add(plate);
    const pin=new THREE.Mesh(new THREE.BoxGeometry(.03,.006,.006),new THREE.MeshBasicMaterial({color:'#8fa6cf'}));pin.position.set(.018,0,.065);g.add(pin);
  }

  // One high-contrast rendered object per distinct electrode in the CSV. Colors show scenario state, not neural activity.
  const contactMesh=new THREE.InstancedMesh(new THREE.CircleGeometry(.0109,9),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,toneMapped:false}),points.length);
  const dummy=new THREE.Object3D(), normal=new THREE.Vector3(), front=new THREE.Vector3(0,0,1);
  for(const p of points){
    normal.set(p.x/R,p.z/R,-p.y/R).normalize();dummy.position.copy(normal).multiplyScalar(1.004);
    dummy.quaternion.setFromUnitVectors(front,normal);dummy.updateMatrix();contactMesh.setMatrixAt(p.id,dummy.matrix);contactMesh.setColorAt(p.id,cold[p.sector]);
  }
  contactMesh.instanceMatrix.needsUpdate=true;liner.add(contactMesh);

  let yaw=initialYaw, tilt=initialTilt, targetYaw=yaw,targetTilt=tilt;
  let mode='array',lift=0, targetLift=0, frame=0, lost=false, drag=null;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  function request(){if(!frame&&!lost)frame=requestAnimationFrame(draw);}
  function draw(){
    frame=0;if(lost)return;
    const ease=media.matches?1:.24;
    yaw+=(targetYaw-yaw)*ease; tilt+=(targetTilt-tilt)*ease; lift+=(targetLift-lift)*ease;
    cover.visible = mode==='shell'||mode==='layers';
    liner.visible=mode!=='shell';
    cover.position.set(0,mode==='layers'?lift:.003,mode==='layers'?-.30*lift:0);
    cover.rotation.x=mode==='layers'?-.31*lift:0;
    const y=.43+(mode==='layers'?.32*lift:0);
    const distance=5;
    camera.position.set(distance*Math.cos(tilt)*Math.sin(yaw),y+distance*Math.sin(tilt),distance*Math.cos(tilt)*Math.cos(yaw));camera.lookAt(0,y,0);
    THREErender.render(scene,camera);
    if(Math.abs(targetYaw-yaw)+Math.abs(targetTilt-tilt)+Math.abs(targetLift-lift)>.001)request();
  }
  function resize(){
    if(lost)return;
    const a=stage.clientWidth,b=stage.clientHeight;if(!a||!b)return;
    THREErender.setSize(a,b,false);
    const rat=a/b, half=mode==='layers'?1.40:1.30;
    const h=Math.max(half,1.46/rat);
    camera.left=-h*rat;camera.right=h*rat;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();request();
  }
  const observer=new ResizeObserver(resize);
  function detach(){lost=true;cancelAnimationFrame(frame);observer.disconnect();canvas.remove();THREErender.dispose();fail();}
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();detach();},{once:true});
  canvas.addEventListener('pointerdown',e=>{
    if(drag||e.button!==0)return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove',e=>{
    if(drag?.id!==e.pointerId)return;
    targetYaw+=(e.clientX-drag.x)*.009;targetTilt=clamp(targetTilt+(e.clientY-drag.y)*.007,-.12,1.48);drag.x=e.clientX;drag.y=e.clientY;request();
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture']){
    canvas.addEventListener(name,e=>{if(drag?.id===e.pointerId){drag=null;canvas.classList.remove('is-dragging');}});
  }
  stage.append(canvas);observer.observe(stage);resize();
  return {
    setMode(next){mode=next;targetLift=next==='layers'?.86:0;if(next==='layers')targetTilt=.38;resize();},
    setFault(mask,orient=false){
      let x=0,z=0,n=0;
      for(const p of points){
        const bad=mask[p.id];contactMesh.setColorAt(p.id,bad?amber:cold[p.sector]);
        if(bad){x+=p.x;z-=p.y;n++;}
      }
      contactMesh.instanceColor.needsUpdate=true;
      if(orient&&n>0&&n<3000&&Math.hypot(x,z)/n>10){
        const angle=Math.atan2(x,z);targetYaw+=Math.atan2(Math.sin(angle-targetYaw),Math.cos(angle-targetYaw));targetTilt=.86;
      }
      request();
    },
    rotate(direction){targetYaw+=direction*.48;request();},
    top(){targetTilt=1.48;request();},
    reset(){targetYaw=initialYaw;targetTilt=mode==='layers'?.38:initialTilt;request();},
  };
}
