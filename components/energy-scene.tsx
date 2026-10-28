'use client';

import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

type Props={night:boolean;sunlight:number;outage:boolean;solar:number;battery:number;grid:number;lit:boolean;active:number;resetVersion:number;onReady:()=>void;onUnavailable:()=>void};
type XYZ=[number,number,number];
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));

export default function EnergyScene(props:Props){
 const host=useRef<HTMLDivElement>(null),latest=useRef(props);const[failed,setFailed]=useState(false);
 useEffect(()=>{latest.current=props},[props]);
 useEffect(()=>{
  const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFailed(true);latest.current.onUnavailable();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-6,6,5,-5,.1,70),target=new THREE.Vector3(.15,1.45,0);
  const materials=new Set<THREE.Material>(),geometries=new Set<THREE.BufferGeometry>(),textures=new Set<THREE.Texture>();
  const mat=(p:THREE.MeshStandardMaterialParameters)=>{const m=new THREE.MeshStandardMaterial(p);materials.add(m);return m;};
  const mesh=(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene)=>{geometries.add(g);const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
  const box=(w:number,h:number,d:number,pos:XYZ,m:THREE.Material,parent:THREE.Object3D=scene)=>{const o=mesh(new THREE.BoxGeometry(w,h,d),m,parent);o.position.set(...pos);return o;};
  const tube=(points:XYZ[],radius:number,m:THREE.Material)=>{const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');mesh(new THREE.TubeGeometry(curve,100,radius,8,false),m);return curve;};
  const paper=mat({color:0xe7e7e3,roughness:.7}),wall=mat({color:0xe6e6e2,roughness:.68}),wallSide=mat({color:0xc2c3bf,roughness:.65}),trim=mat({color:0x777a74,roughness:.36,metalness:.38}),frame=mat({color:0x565a54,roughness:.36,metalness:.35}),dark=mat({color:0x252824,roughness:.65}),roofMat=mat({color:0xd4d5d1,roughness:.62}),cell=mat({color:0x323530,roughness:.3,metalness:.28}),cable=mat({color:0x363a35,roughness:.72}),conduit=mat({color:0x858780,roughness:.55,metalness:.22});
  const hemi=new THREE.HemisphereLight(0xffffff,0x62645f,2.3);scene.add(hemi);const sunLight=new THREE.DirectionalLight(0xffffff,3.4);sunLight.position.set(-5,9,7);sunLight.castShadow=true;sunLight.shadow.mapSize.set(1536,1536);sunLight.shadow.camera.left=-8;sunLight.shadow.camera.right=8;sunLight.shadow.camera.top=8;sunLight.shadow.camera.bottom=-8;scene.add(sunLight);const moonLight=new THREE.DirectionalLight(0xffffff,.1);moonLight.position.set(5,7,-5);scene.add(moonLight);
  const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.6;pmrem.dispose();room.dispose();
  // An open-front Kerala home, with overhanging roof, balcony line and a readable interior cutaway.
  const plinth=box(8.6,.2,5.3,[.1,-.16,.05],paper);plinth.receiveShadow=true;box(8.5,.04,5.2,[.1,-.28,.05],wallSide);
  const house=new THREE.Group();house.position.set(-.75,0,-.05);scene.add(house);
  box(5.1,.12,3.7,[0,.12,0],wallSide,house);
  // Rear and side walls leave the front elevation open for a clear view inside.
  box(5.05,2.65,.16,[0,1.43,-1.72],wall,house);box(.16,2.65,3.55,[-2.48,1.43,.03],wallSide,house);box(.16,2.65,3.55,[2.48,1.43,.03],wall,house);
  // A short upper facade and deep lintel create the house silhouette from the hero drawing.
  box(5.22,.16,3.94,[0,2.78,-.02],trim,house);box(5.02,.11,.18,[0,2.88,1.68],wall,house);
  for(const x of [-2.38,-.08,2.22])box(.16,2.58,.2,[x,1.42,1.72],wall,house);
  box(2.15,.14,.2,[-1.23,.49,1.72],wall,house);box(2.15,.14,.2,[1.07,.49,1.72],wall,house);
  // Room dividers and a simple living-room silhouette remain visible behind the glazing.
  box(.1,2.1,3.2,[.12,1.18,-.06],wallSide,house);box(2.2,.55,.62,[-1.16,.62,-.05],wallSide,house);box(1.25,.47,.55,[1.27,.46,-.25],wallSide,house);
  const windowMat=mat({color:0xcfd0cb,roughness:.19,metalness:.08,transparent:true,opacity:.34,emissive:0xffffff,emissiveIntensity:0,side:THREE.DoubleSide,depthWrite:false});
  for(const [x,w] of [[-1.23,2.15],[1.07,2.15]] as [number,number][]){const glass=box(w,1.7,.035,[x,.99,1.715],windowMat,house);glass.castShadow=false;}
  for(const x of [-2.3,-.15,2])box(.035,1.75,.055,[x,.99,1.76],frame,house);box(5,.045,.055,[0,.49,1.76],frame,house);box(5,.045,.055,[0,1.83,1.76],frame,house);
  const windowGlow=new THREE.PointLight(0xffffff,0,7,2);windowGlow.position.set(0,1.48,.78);scene.add(windowGlow);const innerGlow=new THREE.PointLight(0xffffff,0,4,2);innerGlow.position.set(-1.1,1.35,.5);scene.add(innerGlow);
  // Low pitched roof plane and four crisp photovoltaic modules.
  const roof=box(5.75,.18,4.35,[0,3.08,-.02],roofMat,house);roof.rotation.z=-.13;
  box(5.95,.13,.16,[0,2.98,2.14],trim,house);box(5.95,.13,.16,[0,3.56,-2.14],trim,house);
  const array=new THREE.Group();array.position.set(-.05,3.23,-.05);array.rotation.z=-.13;house.add(array);
  const panelFrame=mat({color:0x9a9c96,roughness:.32,metalness:.48});
  for(let row=0;row<2;row++)for(let col=0;col<2;col++){
   const x=(col-.5)*2.18,z=(row-.5)*1.42;box(2.08,.055,1.34,[x,0,z],panelFrame,array);box(2.0,.025,1.26,[x,.034,z],cell,array);
   for(let i=1;i<6;i++)box(.012,.012,1.22,[x-.99+i*.33,.05,z],trim,array);for(let i=1;i<4;i++)box(1.96,.012,.012,[x,.05,z-.61+i*.305],trim,array);
  }
  // Inverter and battery sit beside the house, connected by routed exterior cabling.
  box(1.02,1.48,.62,[3.15,.76,.82],wall,scene);box(1.06,.16,.68,[3.15,.11,.82],wallSide,scene);box(.72,.34,.04,[3.15,1.08,1.145],dark,scene);box(.62,.045,.035,[3.15,1.08,1.18],paper,scene);
  for(let i=0;i<5;i++)box(.72,.025,.03,[3.15,.56+i*.09,1.145],trim,scene);
  box(.96,1.02,.62,[3.15,.56,-.45],wall,scene);box(1.02,.14,.68,[3.15,.09,-.45],wallSide,scene);box(.72,.15,.035,[3.15,.83,-.125],dark,scene);
  for(let i=0;i<4;i++)box(.12,.055,.035,[2.9+i*.17,.83,-.1],i<3?paper:trim,scene);
  box(.52,.9,.4,[4.12,.49,-.92],wallSide,scene);box(.4,.25,.035,[4.12,.69,-.705],dark,scene);box(.19,.035,.035,[4.12,.7,-.67],paper,scene);
  const start=new THREE.Vector3(-.05,0,-.05);array.updateMatrixWorld(true);array.localToWorld(start);const startX=start.x,startY=3.29,startZ=start.z;
  const paths=[
   {kind:'solar',curve:tube([[startX,startY,startZ],[1.9,3.05,.5],[2.25,2.1,.85],[2.58,1.75,.95],[2.64,1.5,1.13]],.026,cable)},
   {kind:'battery',curve:tube([[2.64,1.47,1.13],[2.9,1.28,.9],[3.05,.95,.15],[3.14,.85,-.12],[3.15,.59,-.12]],.027,conduit)},
   {kind:'home',curve:tube([[2.64,1.4,1.13],[2.3,1.22,1.4],[1.55,1.15,1.61],[.8,1.1,1.65],[.12,1.02,1.7]],.025,cable)},
   {kind:'grid',curve:tube([[3.18,.7,-.14],[3.55,.4,-.4],[3.82,.22,-.55],[4.12,.2,-.73]],.023,conduit)}
  ];
  // A restrained exterior meter and junction detail make the electrical route legible.
  box(.33,.54,.13,[.26,1.08,1.57],wallSide,house);box(.21,.13,.025,[.26,1.15,1.65],dark,house);box(.13,.025,.024,[.26,1.15,1.668],paper,house);
  const particleMat=new THREE.MeshBasicMaterial({color:0xf7f7f2});materials.add(particleMat);const particles=paths.flatMap((p,j)=>Array.from({length:3},(_,i)=>({kind:p.kind,curve:p.curve,phase:i/3+j*.09,object:mesh(new THREE.SphereGeometry(.038,10,8),particleMat)})));
  const sunMat=new THREE.MeshBasicMaterial({color:0xf8f8f3});materials.add(sunMat);const sun=mesh(new THREE.SphereGeometry(.28,32,24),sunMat);sun.position.set(-4.8,4.15,-1.2);sun.castShadow=false;
  const moonMat=new THREE.MeshStandardMaterial({color:0xc7c8c4,emissive:0xbfc1bc,emissiveIntensity:.25,transparent:true,opacity:0,roughness:.92});materials.add(moonMat);const moon=mesh(new THREE.SphereGeometry(.27,32,24),moonMat);moon.position.copy(sun.position);moon.castShadow=false;
  const stars=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0xdfe0db,size:.035,transparent:true,opacity:0}));const starPos=[];let seed=14;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};for(let i=0;i<35;i++)starPos.push((random()-.5)*10,3+random()*2.8,-1.9-random());stars.geometry.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));geometries.add(stars.geometry);materials.add(stars.material as THREE.Material);scene.add(stars);
  const resize=()=>{const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight),aspect=w/h,frustumH=Math.max(7.5,10.4/aspect);camera.left=-frustumH*aspect/2;camera.right=frustumH*aspect/2;camera.top=frustumH/2;camera.bottom=-frustumH/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(el);resize();
  let visible=true,frameId=0,last=performance.now(),blend=latest.current.night?1:0,orbit=latest.current.night?Math.PI:0,orbitGoal=orbit,lastNight=latest.current.night,drag=false,lastX=0,azimuth=.48,desiredAzimuth=.48,lastReset=latest.current.resetVersion;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'100px'});intersection.observe(el);
  const down=(e:PointerEvent)=>{if(e.button!==0)return;drag=true;lastX=e.clientX;if(e.pointerType==='mouse')renderer.domElement.setPointerCapture(e.pointerId)};const move=(e:PointerEvent)=>{if(!drag)return;const dx=e.clientX-lastX;desiredAzimuth=clamp(desiredAzimuth+dx*.003,-.28,1);lastX=e.clientX};const up=()=>{drag=false};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);
  const contextLost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frameId);setFailed(true);latest.current.onUnavailable()};renderer.domElement.addEventListener('webglcontextlost',contextLost);
  const animate=(now:number)=>{frameId=requestAnimationFrame(animate);const dt=Math.min(.05,(now-last)/1000);last=now;if(!visible)return;const p=latest.current,goal=p.night?1:0;if(lastNight!==p.night){lastNight=p.night;orbitGoal+=Math.PI}orbit=reduced.matches?orbitGoal:THREE.MathUtils.damp(orbit,orbitGoal,1.7,dt);blend=reduced.matches?goal:THREE.MathUtils.damp(blend,goal,2.6,dt);azimuth=reduced.matches?desiredAzimuth:THREE.MathUtils.damp(azimuth,desiredAzimuth,5,dt);if(lastReset!==p.resetVersion){lastReset=p.resetVersion;desiredAzimuth=.48}
   camera.position.set(Math.sin(azimuth)*14+target.x,8.7,Math.cos(azimuth)*14+target.z);camera.lookAt(target);camera.updateMatrixWorld();sunLight.intensity=(1-blend)*(.8+p.sunlight*.02);hemi.intensity=1.8*(1-blend)+.42*blend;moonLight.intensity=.1+blend*.62;scene.environmentIntensity=.52*(1-blend)+.12*blend;
   windowMat.emissiveIntensity=blend*(p.lit?2.8:.15);windowMat.opacity=.25+blend*.55;windowGlow.intensity=blend*(p.lit?8:0);innerGlow.intensity=blend*(p.lit?5:0);sun.position.set(-4.65*Math.cos(orbit+.62),3.6+1.15*Math.sin(orbit+.62),-1.25);moon.position.set(-4.65*Math.cos(orbit+.62+Math.PI),3.6+1.15*Math.sin(orbit+.62+Math.PI),-1.25);sun.visible=Math.sin(orbit+.62)>-.05;moon.visible=Math.sin(orbit+.62+Math.PI)>-.05;moonMat.opacity=blend; (stars.material as THREE.PointsMaterial).opacity=blend*.42;
   for(const item of particles){const on=item.kind==='solar'?p.solar>.01:item.kind==='grid'?p.grid>.01&&!p.outage:Math.abs(p.battery)>.01||p.lit;item.object.visible=on&&p.lit;if(item.object.visible){let t=(now*.00012+item.phase)%1;if(item.kind==='battery'&&p.battery<0)t=1-t;item.object.position.copy(item.curve.getPointAt(t));}}
   renderer.render(scene,camera)};
  frameId=requestAnimationFrame(animate);latest.current.onReady();
  return()=>{cancelAnimationFrame(frameId);sizeObserver.disconnect();intersection.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointercancel',up);renderer.domElement.removeEventListener('webglcontextlost',contextLost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove()};
 },[]);
 if(failed)return null;
 return <div ref={host} className={`real-energy-scene ${props.night?'real-scene-night':''}`} role="img" aria-label={`Three-dimensional cutaway Kerala home with rooftop solar panels, inverter, battery and connected power cables. ${props.night?'At night, stored energy lights the rooms inside the house.':'In daylight, the solar panels supply the home and charge storage.'} Drag horizontally to inspect the home.`}/>;
}
