'use client';

import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

type Props={night:boolean;sunlight:number;outage:boolean;solar:number;battery:number;grid:number;lit:boolean;active:number;resetVersion:number;onReady:()=>void;onUnavailable:()=>void};
type XYZ=[number,number,number];
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));

export default function EnergyScene(props:Props){
 const host=useRef<HTMLDivElement>(null),labels=useRef<(HTMLSpanElement|null)[]>([]),latest=useRef(props);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{latest.current=props},[props]);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFailed(true);latest.current.onUnavailable();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-7,7,4.5,-4.5,.1,80);
  const materials=new Set<THREE.Material>(),geometries=new Set<THREE.BufferGeometry>(),textures=new Set<THREE.Texture>();
  const mat=(p:THREE.MeshStandardMaterialParameters)=>{const m=new THREE.MeshStandardMaterial(p);materials.add(m);return m;};
  const white=mat({color:0xe5e5e3,roughness:.36,metalness:.15}),side=mat({color:0xc1c2bf,roughness:.5,metalness:.35}),metal=mat({color:0xbabbb8,roughness:.23,metalness:.85}),dark=mat({color:0x20221f,roughness:.68,metalness:.1}),rubber=mat({color:0x262825,roughness:.86}),floor=mat({color:0xe7e7e3,roughness:.82}),black=mat({color:0x131512,roughness:.28,metalness:.25}),led=mat({color:0xffffff,emissive:0xffffff,emissiveIntensity:.6,roughness:.2});
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D=scene)=>{geometries.add(geometry);const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
  const box=(w:number,h:number,d:number,pos:XYZ,material=white,parent:THREE.Object3D=scene)=>{const m=mesh(new THREE.BoxGeometry(w,h,d),material,parent);m.position.set(...pos);return m;};
  const rounded=(w:number,h:number,d:number,r:number,pos:XYZ,material=white,parent:THREE.Object3D=scene)=>{
   const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
   const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.01,d-r*2),bevelEnabled:true,bevelThickness:r,bevelSize:r*.55,bevelSegments:3,steps:1,curveSegments:6});g.translate(0,0,-d/2+r);const m=mesh(g,material,parent);m.position.set(...pos);return m;
  };
  const cylinder=(rt:number,rb:number,h:number,pos:XYZ,material=metal,parent:THREE.Object3D=scene)=>{const m=mesh(new THREE.CylinderGeometry(rt,rb,h,32),material,parent);m.position.set(...pos);return m;};
  const tube=(points:XYZ[],radius:number,material=rubber,parent:THREE.Object3D=scene)=>{const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)),false,'catmullrom',.35);const m=mesh(new THREE.TubeGeometry(curve,80,radius,9,false),material,parent);return {curve,mesh:m};};
  const labelTexture=(title:string,subtitle:string)=>{const cv=document.createElement('canvas');cv.width=512;cv.height=160;const c=cv.getContext('2d')!;c.fillStyle='#e5e5e2';c.fillRect(0,0,512,160);c.fillStyle='#555952';c.font='38px Arial';c.fillText(title,26,65);c.font='20px monospace';c.fillText(subtitle,28,110);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;textures.add(t);return t;};
  const addPlate=(title:string,subtitle:string,w:number,h:number,pos:XYZ)=>{const m=mat({map:labelTexture(title,subtitle),roughness:.5,metalness:.1});const p=mesh(new THREE.PlaneGeometry(w,h),m);p.position.set(...pos);p.castShadow=false;return p;};
  const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.8;pmrem.dispose();room.dispose();
  const hemi=new THREE.HemisphereLight(0xffffff,0x656762,2.5);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(-4,8,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.025;key.shadow.bias=-.0003;key.shadow.radius=3;scene.add(key);
  const moonlight=new THREE.DirectionalLight(0xe2e4e0,0);moonlight.position.set(-5,7,-3);scene.add(moonlight);
  const rim=new THREE.DirectionalLight(0xffffff,1);rim.position.set(4,4,-5);scene.add(rim);
  // A rounded engineering plinth anchors the complete installation.
  const bench=box(11.5,.16,4.8,[0,-.1,0],floor);bench.receiveShadow=true;
  box(11.46,.035,4.76,[0,-.195,0],side);
  for(const x of [-5.1,5.1])for(const z of [-1.9,1.9])cylinder(.09,.11,.10,[x,-.24,z],dark);
  // Fine drafting marks are engraved into the surface.
  const gridMaterial=new THREE.LineBasicMaterial({color:0xc3c5bf,transparent:true,opacity:.28});materials.add(gridMaterial);
  const gridPoints:THREE.Vector3[]=[];for(let x=-5.4;x<5.5;x+=.5){gridPoints.push(new THREE.Vector3(x,-.011,-2.15),new THREE.Vector3(x,-.011,2.15));}for(let z=-2;z<=2;z+=.5){gridPoints.push(new THREE.Vector3(-5.45,-.011,z),new THREE.Vector3(5.45,-.011,z));}const gridGeometry=new THREE.BufferGeometry().setFromPoints(gridPoints);geometries.add(gridGeometry);scene.add(new THREE.LineSegments(gridGeometry,gridMaterial));
  // Glass-faced photovoltaic module, with separate cells, busbars and frame rails.
  const panel=new THREE.Group();panel.position.set(-3.35,1.15,-.35);panel.rotation.x=.48;scene.add(panel);
  box(3.05,.065,2.13,[0,0,0],side,panel);box(2.96,.016,2.03,[0,.043,0],black,panel);
  const cell=mat({color:0x333631,metalness:.38,roughness:.3});
  for(let row=0;row<8;row++)for(let col=0;col<6;col++){const x=-1.235+col*.493,z=-.88+row*.25;box(.466,.012,.226,[x,.058,z],cell,panel);for(let k=0;k<3;k++)box(.003,.002,.22,[x-.13+k*.13,.066,z],metal,panel);}
  for(const z of [-1.055,1.055])box(3.08,.07,.032,[0,.035,z],metal,panel);for(const x of [-1.52,1.52])box(.032,.07,2.15,[x,.035,0],metal,panel);
  const glassMat=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.105,roughness:.08,metalness:.08,clearcoat:1,clearcoatRoughness:.06,depthWrite:false});materials.add(glassMat);box(2.98,.008,2.06,[0,.075,0],glassMat as THREE.MeshStandardMaterial,panel);
  panel.updateMatrixWorld();const legs:THREE.Vector3[]=[];for(const x of [-1.28,1.28])for(const z of [-.85,.85]){const p=panel.localToWorld(new THREE.Vector3(x,-.05,z));legs.push(p);cylinder(.023,.023,p.y,[p.x,p.y/2,p.z],metal);box(.22,.035,.18,[p.x,.02,p.z],side);}
  for(let i=0;i<4;i+=2)tube([[legs[i].x,.08,legs[i].z],[legs[i+1].x,legs[i+1].y*.8,legs[i+1].z]],.014,metal);
  // Hybrid inverter: a metal cabinet, live screen, cooling slots and service ports.
  rounded(1.07,2.4,.54,.055,[0,1.28,-.8],white);rounded(1.28,.13,.76,.025,[0,.065,-.8],side);
  const screenCanvas=document.createElement('canvas');screenCanvas.width=512;screenCanvas.height=256;const screenContext=screenCanvas.getContext('2d')!,screenTexture=new THREE.CanvasTexture(screenCanvas);screenTexture.colorSpace=THREE.SRGBColorSpace;textures.add(screenTexture);
  const screenMat=mat({map:screenTexture,emissive:0xffffff,emissiveMap:screenTexture,emissiveIntensity:.35,roughness:.28});box(.82,.43,.025,[0,2.05,-.511],screenMat);
  for(let i=0;i<7;i++)rounded(.72,.014,.018,.003,[0,.63+i*.065,-.51],dark);
  const status=cylinder(.025,.025,.013,[0,1.52,-.505],led);status.rotation.x=Math.PI/2;
  addPlate('INTEGRO','HYBRID POWER UNIT',.65,.2,[0,1.25,-.505]);
  for(const x of [-.3,0,.3]){cylinder(.033,.033,.11,[x,.07,-.57],dark);}
  // Modular storage enclosure with an inset display and a real carry handle.
  rounded(1.28,1.36,.67,.045,[-.8,.76,1.15],white);rounded(1.46,.12,.82,.025,[-.8,.065,1.15],side);
  box(.94,.24,.02,[-.8,1.17,1.495],black);for(let i=0;i<6;i++)box(.095,.065,.025,[-1.14+i*.133,1.17,1.512],i<4?led:side);
  for(const y of [.4,.59,.78])box(1.06,.012,.015,[-.8,y,1.49],side);
  tube([[-1.13,1.46,1.15],[-1.13,1.61,1.15],[-.47,1.61,1.15],[-.47,1.46,1.15]],.025,metal);
  addPlate('STORAGE','ENERGY / RESERVED',.72,.18,[-.8,.94,1.495]);
  // Distribution protection enclosure and a separate utility connection.
  rounded(.59,1.02,.35,.025,[2,.6,-1.35],white);rounded(.76,.1,.54,.02,[2,.055,-1.35],side);box(.38,.18,.018,[2,.87,-1.163],dark);for(const x of [1.88,2,2.12])box(.065,.14,.025,[x,.56,-1.15],side);
  rounded(.53,1.15,.36,.025,[4.8,.66,-1.3],white);rounded(.72,.12,.55,.02,[4.8,.06,-1.3],side);box(.34,.25,.025,[4.8,.94,-1.1],black);const gridLED=box(.2,.035,.03,[4.8,.95,-1.08],led);addPlate('GRID','UTILITY LINK',.34,.12,[4.8,.7,-1.105]);
  // A brushed-metal task lamp becomes the visible endpoint of the circuit.
  cylinder(.44,.47,.10,[3.5,.06,.65],metal);cylinder(.06,.075,.12,[3.5,.16,.65],side);
  tube([[3.5,.14,.65],[3.5,2.45,.65],[3.54,2.85,.65],[3.91,3.02,.65],[4.15,2.78,.65],[4.15,2.64,.65]],.036,metal);
  const shadeMat=mat({color:0xd7d8d5,metalness:.55,roughness:.3,side:THREE.DoubleSide});mesh(new THREE.CylinderGeometry(.13,.43,.36,48,1,true),shadeMat).position.set(4.15,2.47,.65);
  const bulb=mesh(new THREE.SphereGeometry(.095,24,16),led);bulb.position.set(4.15,2.29,.65);
  const lamp=new THREE.SpotLight(0xffffff,5,8,Math.PI/5,.65,2);lamp.position.set(4.15,2.3,.65);lamp.target.position.set(4.15,0,.65);lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.bias=-.0004;scene.add(lamp,lamp.target);
  const beamMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});materials.add(beamMat);const beam=mesh(new THREE.CylinderGeometry(.04,1.05,2.25,40,1,true),beamMat);beam.position.set(4.15,1.14,.65);beam.castShadow=false;beam.receiveShadow=false;
  // Cables use smooth spatial curves; every endpoint is attached to a real port.
  const solarStart=panel.localToWorld(new THREE.Vector3(1.47,-.04,.9));
  const cables=[
   {type:'solar',...tube([[solarStart.x,solarStart.y,solarStart.z],[-2.05,.2,.7],[-2.4,.04,1.18],[-2.1,.04,1.55],[-1.5,.04,.55],[-1,.04,-.3],[-.3,.09,-.57]],.025)},
   {type:'battery',...tube([[0,.09,-.57],[.75,.045,.2],[.67,.045,1.87],[-.12,.045,2],[-.8,.12,1.51]],.027)},
   {type:'ac',...tube([[.3,.09,-.57],[1,.045,-.2],[1.7,.045,-.9],[2,.16,-1.15]],.027)},
   {type:'lamp',...tube([[2.23,.16,-1.15],[3,.045,-.65],[4.68,.045,.1],[4.45,.045,1.45],[3.7,.045,1.65],[3.5,.09,.65]],.024)},
   {type:'grid',...tube([[4.8,.18,-1.1],[5,.05,-1.8],[4.3,.05,-2.05],[2.6,.05,-2.08],[1.3,.05,-1.8],[.25,.13,-1.08]],.023)}
  ];
  const particleMaterial=new THREE.MeshBasicMaterial({color:0xffffff});materials.add(particleMaterial);const particles=cables.flatMap((c,j)=>Array.from({length:3},(_,i)=>{const p=mesh(new THREE.SphereGeometry(.034,8,8),particleMaterial);p.castShadow=false;return{mesh:p,cable:c,offset:i/3+j*.07}}));
  // Sun and moon are separate three-dimensional bodies sharing the same orbit.
  const sunMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1});materials.add(sunMat);const sun=mesh(new THREE.SphereGeometry(.39,48,32),sunMat);sun.position.set(-4.4,3.6,-1.35);sun.castShadow=false;
  const haloCanvas=document.createElement('canvas');haloCanvas.width=haloCanvas.height=128;const hc=haloCanvas.getContext('2d')!,haloGradient=hc.createRadialGradient(64,64,10,64,64,64);haloGradient.addColorStop(0,'rgba(255,255,255,.7)');haloGradient.addColorStop(.35,'rgba(255,255,255,.22)');haloGradient.addColorStop(1,'rgba(255,255,255,0)');hc.fillStyle=haloGradient;hc.fillRect(0,0,128,128);const haloTexture=new THREE.CanvasTexture(haloCanvas);textures.add(haloTexture);const haloMat=new THREE.SpriteMaterial({map:haloTexture,transparent:true,opacity:.6,depthWrite:false});materials.add(haloMat);const halo=new THREE.Sprite(haloMat);halo.scale.setScalar(1.8);halo.position.copy(sun.position);scene.add(halo);const coronaMat=new THREE.MeshBasicMaterial({color:0x9b9e97,transparent:true,opacity:.4,side:THREE.DoubleSide});materials.add(coronaMat);const corona=mesh(new THREE.RingGeometry(.47,.476,64),coronaMat);corona.castShadow=false;corona.receiveShadow=false;corona.position.copy(sun.position);
  const moonCanvas=document.createElement('canvas');moonCanvas.width=512;moonCanvas.height=256;const mc=moonCanvas.getContext('2d')!;mc.fillStyle='#bdbfba';mc.fillRect(0,0,512,256);let seed=37;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};for(let i=0;i<170;i++){const x=random()*512,y=random()*256,r=2+random()*19,g=mc.createRadialGradient(x-r*.25,y-r*.25,.1,x,y,r);g.addColorStop(0,'#969a93');g.addColorStop(.64,'#a1a59d');g.addColorStop(.82,'#d5d8d1');g.addColorStop(1,'#bdbfba');mc.fillStyle=g;mc.beginPath();mc.arc(x,y,r,0,Math.PI*2);mc.fill();}const moonTexture=new THREE.CanvasTexture(moonCanvas);moonTexture.colorSpace=THREE.SRGBColorSpace;textures.add(moonTexture);const moonMat=mat({map:moonTexture,bumpMap:moonTexture,bumpScale:.018,roughness:1,transparent:true,opacity:0,emissive:0xc8cac5,emissiveMap:moonTexture,emissiveIntensity:.3});const moon=mesh(new THREE.SphereGeometry(.38,48,32),moonMat);moon.position.copy(sun.position);moon.castShadow=false;
  const starPositions=[];for(let i=0;i<65;i++)starPositions.push((random()-.5)*15,2.5+random()*3.5,-3.1-random()*1.5);const starsGeometry=new THREE.BufferGeometry();starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));geometries.add(starsGeometry);const starMat=new THREE.PointsMaterial({color:0x777b72,size:.025,transparent:true,opacity:0,sizeAttenuation:true});materials.add(starMat);scene.add(new THREE.Points(starsGeometry,starMat));
  const annotationPoints=[new THREE.Vector3(-3.4,1.6,-.9),new THREE.Vector3(0,2.72,-.8),new THREE.Vector3(-.8,1.82,1.15),new THREE.Vector3(4.15,3.18,.65)];
  const target=new THREE.Vector3(0,1.1,0);let azimuth=.63,polar=1.02,desiredAzimuth=.63,desiredPolar=1.02,drag=false,lastX=0,lastY=0,visible=true,frame=0,lastTime=performance.now(),blend=latest.current.night?1:0,lastScreen='',lastReset=latest.current.resetVersion;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const resize=()=>{const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight),aspect=w/h,v=Math.max(9,14.2/aspect);camera.left=-v*aspect/2;camera.right=v*aspect/2;camera.top=v/2;camera.bottom=-v/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'100px'});intersection.observe(el);
  const down=(e:PointerEvent)=>{if(e.button!==0)return;drag=true;lastX=e.clientX;lastY=e.clientY;if(e.pointerType==='mouse')renderer.domElement.setPointerCapture(e.pointerId);};
  const move=(e:PointerEvent)=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx))return;desiredAzimuth=clamp(desiredAzimuth+dx*.004,.15,1.15);desiredPolar=clamp(desiredPolar+dy*.003,.75,1.25);lastX=e.clientX;lastY=e.clientY;};const up=()=>{drag=false};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);renderer.domElement.addEventListener('lostpointercapture',up);
  const contextLost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);setFailed(true);latest.current.onUnavailable()};renderer.domElement.addEventListener('webglcontextlost',contextLost);
  const animate=(now:number)=>{frame=requestAnimationFrame(animate);const delta=Math.min(.05,(now-lastTime)/1000);lastTime=now;if(!visible)return;const p=latest.current,goal=p.night?1:0;if(lastReset!==p.resetVersion){lastReset=p.resetVersion;desiredAzimuth=.63;desiredPolar=1.02;}blend=reduced.matches?goal:THREE.MathUtils.damp(blend,goal,3,delta);azimuth=reduced.matches?desiredAzimuth:THREE.MathUtils.damp(azimuth,desiredAzimuth,7,delta);polar=reduced.matches?desiredPolar:THREE.MathUtils.damp(polar,desiredPolar,7,delta);camera.position.set(Math.sin(azimuth)*Math.sin(polar)*16,Math.cos(polar)*16,Math.cos(azimuth)*Math.sin(polar)*16).add(target);camera.lookAt(target);camera.updateMatrixWorld();
   key.intensity=(1-blend)*(.8+p.sunlight*.02);hemi.intensity=1.65*(1-blend)+.5*blend;rim.intensity=.9*(1-blend)+.3*blend;moonlight.intensity=blend*.6;scene.environmentIntensity=.65*(1-blend)+.16*blend;floor.color.setRGB(.78*(1-blend)+.5*blend,.78*(1-blend)+.5*blend,.76*(1-blend)+.49*blend);lamp.intensity=p.lit?5+blend*35:0;beamMat.opacity=p.lit?blend*.025:0;led.emissiveIntensity=.3+blend*.8;
   sunMat.opacity=1-blend;sun.position.y=3.6+blend*1.4;sun.visible=blend<.995;halo.position.copy(sun.position);corona.position.copy(sun.position);corona.quaternion.copy(camera.quaternion);coronaMat.opacity=(1-blend)*.4;haloMat.opacity=(1-blend)*.6;moonMat.opacity=blend;moon.position.y=3.6+(1-blend)*1.4;moon.visible=blend>.005;starMat.opacity=blend*.55;gridLED.visible=!p.outage;moon.rotation.y=.55;
   for(const particle of particles){const t=particle.cable.type;const running=t==='solar'?p.solar>.01:t==='grid'?p.grid>.01&&!p.outage:true;particle.mesh.visible=running&&p.lit&&!reduced.matches;if(particle.mesh.visible){let phase=(now*.00015+particle.offset)%1;if(t==='grid'||(t==='battery'&&p.battery<0))phase=1-phase;particle.mesh.position.copy(particle.cable.curve.getPointAt(phase));particle.mesh.position.y+=.025;}}
   const screenText=`${p.solar.toFixed(1)}|${p.night}|${p.outage}`;if(screenText!==lastScreen){lastScreen=screenText;screenContext.fillStyle='#151814';screenContext.fillRect(0,0,512,256);screenContext.fillStyle='#8b9387';screenContext.font='22px monospace';screenContext.fillText('INTEGRO / ENERGY',28,43);screenContext.fillStyle='#f3f6ee';screenContext.font='68px monospace';screenContext.fillText(`${p.solar.toFixed(1)} kW`,25,133);screenContext.fillStyle='#a4ada0';screenContext.font='20px monospace';screenContext.fillText(p.outage?'BACKUP / GRID ISOLATED':p.night?'STORAGE / AFTER SUNSET':'SOLAR / GENERATING',28,201);screenTexture.needsUpdate=true;}
   annotationPoints.forEach((point,i)=>{const label=labels.current[i];if(!label)return;const screen=point.clone().project(camera);label.style.left=`${(screen.x*.5+.5)*100}%`;label.style.top=`${(-screen.y*.5+.5)*100}%`;});renderer.render(scene,camera);
  };frame=requestAnimationFrame(animate);latest.current.onReady();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointercancel',up);renderer.domElement.removeEventListener('lostpointercapture',up);renderer.domElement.removeEventListener('webglcontextlost',contextLost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 if(failed)return null;
 return <div ref={host} className={`real-energy-scene ${props.night?'real-scene-night':''}`} role="img" aria-label={`Interactive three-dimensional solar installation in ${props.night?'night mode with the moon visible and a glowing lamp':'day mode with the sun visible and soft directional shadows'}. Drag horizontally to inspect the equipment.`}>{['01 / SOLAR ARRAY','02 / HYBRID INVERTER','03 / STORAGE','04 / EVERYDAY LIFE'].map((label,i)=><span key={label} ref={el=>{labels.current[i]=el}} className={`real-scene-label ${props.active===i?'label-active':''}`}>{label}</span>)}</div>
}
