'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
type Trace={w:number;h:number;hash:string;lines:number[][]};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
function noise(x:number,y:number){const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v)}
function smoothNoise(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);return(noise(ix,iy)*(1-sx)+noise(ix+1,iy)*sx)*(1-sy)+(noise(ix,iy+1)*(1-sx)+noise(ix+1,iy+1)*sx)*sy}
// Trace the actual artwork so every outline stays registered with its colour layer.
function paintOutline(img:HTMLImageElement,cv:HTMLCanvasElement){
 const ctx=cv.getContext('2d');if(!ctx)return;
 const w=cv.width,h=cv.height;ctx.drawImage(img,0,0,w,h);
 const input=ctx.getImageData(0,0,w,h),output=ctx.createImageData(w,h),lum=new Float32Array(w*h);
 for(let i=0;i<lum.length;i++){const k=i*4,a=input.data[k+3]/255;lum[i]=(input.data[k]*.299+input.data[k+1]*.587+input.data[k+2]*.114)*a+255*(1-a)}
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
  const i=y*w+x,k=i*4;
  const gx=-lum[i-w-1]+lum[i-w+1]-2*lum[i-1]+2*lum[i+1]-lum[i+w-1]+lum[i+w+1];
  const gy=-lum[i-w-1]-2*lum[i-w]-lum[i-w+1]+lum[i+w-1]+2*lum[i+w]+lum[i+w+1];
  const edge=Math.sqrt(gx*gx+gy*gy);
  output.data[k]=88;output.data[k+1]=77;output.data[k+2]=60;output.data[k+3]=Math.min(190,Math.max(0,edge-35)*1.1);
 }
 ctx.clearRect(0,0,w,h);ctx.putImageData(output,0,0);
}
export function BlueprintReveal({progress=0,scrub=false,onReady,src='/artwork/solar-home-watercolor-cutout.webp',traceSrc='',alt='Watercolor illustration of a Kerala home with blue rooftop solar panels and tropical gardens'}:{progress?:number;scrub?:boolean;onReady?:()=>void;src?:string;traceSrc?:string;alt?:string}){
 const outline=useRef<HTMLCanvasElement>(null),canvas=useRef<HTMLCanvasElement>(null),image=useRef<HTMLImageElement|null>(null),mask=useRef<HTMLCanvasElement|null>(null),field=useRef<Float32Array|null>(null),target=useRef(0),current=useRef(0),frame=useRef(0),reduced=useRef(false),mounted=useRef(false),scrollProgress=useRef(progress);
 const [trace,setTrace]=useState<Trace|null>(null),[ready,setReady]=useState(false);
 const draw=useCallback(()=>{const cv=canvas.current,img=image.current,m=mask.current,f=field.current;if(!cv||!img||!m||!f)return;const ctx=cv.getContext('2d'),mctx=m.getContext('2d');if(!ctx||!mctx)return;const p=current.current;if(outline.current)outline.current.style.opacity=String(1-clamp((p-.15)/.85));const pixels=mctx.createImageData(m.width,m.height);for(let i=0;i<f.length;i++){pixels.data[i*4]=255;pixels.data[i*4+1]=255;pixels.data[i*4+2]=255;pixels.data[i*4+3]=Math.round(clamp((p-f[i])/.14)*255)}mctx.putImageData(pixels,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.globalCompositeOperation='source-over';ctx.imageSmoothingEnabled=true;ctx.drawImage(m,0,0,cv.width,cv.height);ctx.globalCompositeOperation='source-in';ctx.drawImage(img,0,0,cv.width,cv.height);ctx.globalCompositeOperation='source-over';},[]);
 useEffect(()=>{mounted.current=true;const media=matchMedia('(prefers-reduced-motion: reduce)');reduced.current=media.matches;const handler=()=>{reduced.current=media.matches;if(media.matches){target.current=1.2;current.current=1.2;draw()}};media.addEventListener('change',handler);const m=document.createElement('canvas');m.width=384;m.height=256;mask.current=m;const f=new Float32Array(m.width*m.height);for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){const blot=smoothNoise(x/40,y/40)*.55+smoothNoise(x/16,y/16)*.3+smoothNoise(x/6,y/6)*.15;f[y*m.width+x]=.15+(y/m.height)*.47+blot*.23+noise(x,y)*.03}field.current=f;
 if(traceSrc)fetch(traceSrc).then(r=>r.json()).then(d=>{if(mounted.current)setTrace(d)}).catch(()=>{});const img=new Image();img.onload=()=>{if(!mounted.current)return;image.current=img;if(outline.current)paintOutline(img,outline.current);setReady(true);onReady?.();if(scrub){current.current=reduced.current?1.2:scrollProgress.current*1.1;draw();return}let start=0;const animate=(time:number)=>{if(!mounted.current)return;if(!start)start=time;const intro=clamp((time-start-500)/2600)*1.1;target.current=reduced.current?1.2:Math.max(intro,scrollProgress.current*1.1);current.current+=(target.current-current.current)*.065;draw();if(time-start<5000||Math.abs(target.current-current.current)>.002)frame.current=requestAnimationFrame(animate)};frame.current=requestAnimationFrame(animate)};img.src=src;return()=>{mounted.current=false;cancelAnimationFrame(frame.current);media.removeEventListener('change',handler)};
 // The entrance is intentionally initialized once; subsequent scroll progress is applied below.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[draw]);
 useEffect(()=>{scrollProgress.current=progress;if(!scrub||!ready)return;target.current=reduced.current?1.2:clamp(progress)*1.1;cancelAnimationFrame(frame.current);const animate=()=>{if(!mounted.current)return;current.current+=(target.current-current.current)*.15;if(Math.abs(target.current-current.current)<.001)current.current=target.current;draw();if(current.current!==target.current)frame.current=requestAnimationFrame(animate)};frame.current=requestAnimationFrame(animate);return()=>cancelAnimationFrame(frame.current)},[progress,scrub,ready,draw]);
 return <div className={`blueprint-reveal ${ready?'ready':''} ${scrub?'blueprint-scrub':''}`} style={scrub?{'--reveal-progress':progress} as React.CSSProperties:undefined}><img className="blueprint-fallback" src={src} width="1536" height="1024" alt={alt} fetchPriority="high"/><canvas ref={canvas} width="1536" height="1024" aria-hidden="true"/><canvas ref={outline} className="watercolor-outline" width="768" height="512" aria-hidden="true"/>{trace&&<svg viewBox={`0 0 ${trace.w} ${trace.h}`} className="blueprint-trace" aria-hidden="true">{trace.lines.map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} pathLength="1" style={{animationDelay:`${(1-l[1]/trace.h)*.55+(i%9)*.035}s`,animationDuration:`${.7+(i%5)*.12}s`}}/>)}</svg>}<div className="blueprint-scan" aria-hidden="true"/><div className="reveal-registration" aria-hidden="true"><span>+</span><span>+</span><span>+</span><span>+</span></div></div>
}
