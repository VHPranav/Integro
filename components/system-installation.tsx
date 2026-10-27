'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
const descriptions=['Rooftop solar connected to the home and utility grid','Solar, grid and modular battery storage connected as one hybrid system','A battery reserve supplying essential home circuits'];
export default function Installation({system}:{system:number}){
 const host=useRef<HTMLDivElement>(null),selection=useRef(system);const [failed,setFailed]=useState(false);
 useEffect(()=>{selection.current=system},[system]);
 useEffect(()=>{
 const el=host.current!;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5,5,4,-4,.1,50),objects:THREE.BufferGeometry[]=[],materials:THREE.Material[]=[];
 const material=(color:number,metalness=.1)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.5,metalness});materials.push(m);return m};const white=material(0xe4e4de),silver=material(0xaaaDa6,.65),dark=material(0x343830),glass=material(0x595e54,.35),paper=material(0xf0f0e9),light=material(0xffffff);
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m=white,parent:THREE.Object3D=scene)=>{const g=new THREE.BoxGeometry(w,h,d);objects.push(g);const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o};
 const lineMat=new THREE.LineBasicMaterial({color:0x8c9185,transparent:true,opacity:.3});materials.push(lineMat);
 const edges=(o:THREE.Mesh)=>{const g=new THREE.EdgesGeometry(o.geometry);objects.push(g);o.add(new THREE.LineSegments(g,lineMat))};
 scene.add(new THREE.HemisphereLight(0xffffff,0x8c9185,2.7));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,8,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.04;scene.add(key);
 const plinth=box(8,.12,5,0,-.12,0,paper);edges(plinth);
 const home=new THREE.Group();home.position.set(-1.3,0,-.35);scene.add(home);
 edges(box(2.8,1.7,2.1,0,.85,0,white,home));box(3.1,.12,2.4,0,1.75,0,paper,home);box(.55,1.2,.035,.6,.6,1.07,dark,home);for(const x of [-.8,-.15]){box(.47,.65,.045,x,1,1.08,glass,home);box(.025,.65,.05,x,1,1.11,silver,home)}box(3,.08,.7,0,.03,1.3,silver,home);
 const roof=new THREE.Group();roof.position.set(0,1.9,0);roof.rotation.x=.2;home.add(roof);
 for(let j=0;j<2;j++){box(1.22,.07,1.7,-.66+j*1.32,0,0,silver,roof);for(let r=0;r<6;r++)for(let c=0;c<4;c++)box(.275,.02,.25,-1.1+j*1.32+c*.292,.05,-.66+r*.265,dark,roof);}
 const reserve=new THREE.Group();scene.add(reserve);reserve.position.set(.8,0,1.1);
 for(let j=0;j<2;j++){const b=box(.65,1.12,.6,j*.75,.62,0,white,reserve);edges(b);box(.45,.14,.025,j*.75,.98,.315,dark,reserve);for(let k=0;k<4;k++)box(.06,.04,.03,j*.75-.15+k*.1,.98,.335,light,reserve);box(.7,.1,.66,j*.75,.07,0,silver,reserve);}
 const inverter=new THREE.Group();inverter.position.set(.75,0,-1);scene.add(inverter);edges(box(.7,1.6,.5,0,.85,0,white,inverter));box(.5,.3,.03,0,1.35,.27,dark,inverter);for(let i=0;i<5;i++)box(.45,.025,.025,0,.4+i*.08,.27,silver,inverter);
 const grid=new THREE.Group();grid.position.set(2.8,0,-1.15);scene.add(grid);edges(box(.6,1.2,.45,0,.65,0,white,grid));box(.37,.3,.025,0,.95,.24,dark,grid);box(.75,.08,.6,0,.05,0,silver,grid);
 const loads=new THREE.Group();scene.add(loads);loads.position.set(2.8,0,1.1);edges(box(.75,.95,.45,0,.5,0,white,loads));for(let i=0;i<3;i++){box(.13,.22,.04,-.2+i*.2,.55,.25,dark,loads);box(.09,.07,.05,-.2+i*.2,.6,.28,light,loads)}
 const routes:{curve:THREE.CatmullRomCurve3;mesh:THREE.Mesh;type:number;dots:THREE.Mesh[]}[]=[];
 const cable=(p:number[][],type:number)=>{const curve=new THREE.CatmullRomCurve3(p.map(v=>new THREE.Vector3(...v as [number,number,number])));const geo=new THREE.TubeGeometry(curve,48,.025,6,false);objects.push(geo);const mesh=new THREE.Mesh(geo,dark);scene.add(mesh);const dots=Array.from({length:3},()=>{const g=new THREE.SphereGeometry(.05,8,6);objects.push(g);const dot=new THREE.Mesh(g,light);scene.add(dot);return dot});routes.push({curve,mesh,type,dots});};
 cable([[-.1,1.8,-.35],[.25,.25,.1],[.3,.04,-.5],[.75,.15,-.72]],0);cable([[.75,.15,-.72],[1.3,.04,-.4],[2,.04,-1.8],[3,.04,-1.8],[2.8,.2,-.9]],1);cable([[.75,.15,-.72],[.5,.04,.5],[1.1,.04,1.8],[1.55,.15,1.4]],2);cable([[.75,.15,-.72],[1.8,.04,-.1],[3.5,.04,.3],[3.4,.04,1.8],[2.8,.15,1.35]],3);
 let angle=.65,wanted=.65,dragging=false,lastX=0,frame=0,visible=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const down=(e:PointerEvent)=>{if(e.button!==0)return;dragging=true;lastX=e.clientX};const move=(e:PointerEvent)=>{if(!dragging)return;wanted=Math.max(-.3,Math.min(1.3,wanted+(e.clientX-lastX)*.005));lastX=e.clientX};const up=()=>{dragging=false};el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight,aspect=w/h,v=Math.max(6.4,10/aspect);camera.left=-v*aspect/2;camera.right=v*aspect/2;camera.top=v/2;camera.bottom=-v/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};const ro=new ResizeObserver(resize);ro.observe(el);resize();const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting},{rootMargin:'100px'});io.observe(el);
 let previous=performance.now();const draw=(time:number)=>{frame=requestAnimationFrame(draw);const dt=Math.min(.05,(time-previous)/1000);previous=time;if(!visible)return;const s=selection.current;angle=THREE.MathUtils.damp(angle,wanted,6,dt);camera.position.set(Math.sin(angle)*12,8,Math.cos(angle)*12);camera.lookAt(0,.5,0);
 const approach=(o:THREE.Object3D,target:number)=>{o.scale.y=reduced.matches?target:THREE.MathUtils.damp(o.scale.y,target,5,dt);o.visible=o.scale.y>.015};approach(reserve,s===0?.001:1);approach(grid,s===2?.001:1);approach(roof,s===2?.001:1);home.position.y=THREE.MathUtils.damp(home.position.y,s===2?-.18:0,4,dt);
 routes.forEach(route=>{const on=route.type===0?s!==2:route.type===1?s!==2:route.type===2?s!==0:true;route.mesh.visible=on;route.dots.forEach((dot,i)=>{dot.visible=on&&!reduced.matches;dot.position.copy(route.curve.getPointAt((time*.00012+i/3)%1))})});renderer.render(scene,camera)};draw(performance.now());
 const lost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);setFailed(true)};renderer.domElement.addEventListener('webglcontextlost',lost);
 return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);objects.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()};
 },[]);
 return <>{failed?<div className="system-scene-fallback">{descriptions[system]}<br/>Explore the system details alongside.</div>:<div className="system-scene-canvas" ref={host} role="img" aria-label={`${descriptions[system]}. Drag horizontally to rotate.`}/>}</>;
}
