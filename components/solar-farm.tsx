'use client';
import {useEffect,useRef,useState} from 'react';
import {BlueprintReveal} from './blueprint-reveal';

export function SolarFarm(){
 const host=useRef<HTMLDivElement>(null);
 const [visible,setVisible]=useState(false),[progress,setProgress]=useState(0);
 useEffect(()=>{
  const element=host.current;
  if(!element)return;
  const observer=new IntersectionObserver(entries=>{
   if(entries[0]?.isIntersecting){setVisible(true);observer.disconnect()}
  },{threshold:.05});
  observer.observe(element);
  let frame=0;
  const update=()=>{
   frame=0;
   const top=element.getBoundingClientRect().top;
   setProgress(Math.max(0,Math.min(1,(innerHeight*.82-top)/(innerHeight*.67))));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  return()=>{
   observer.disconnect();cancelAnimationFrame(frame);
   window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
  };
 },[]);
 return <div ref={host} className="solar-farm solar-farm-image">
  {visible?<BlueprintReveal scrub progress={progress} src="/artwork/solar-farm-watercolor-cutout.webp" traceSrc="" alt="Watercolor solar farm with blue panels, coconut palms and golden sunlight"/>:<img src="/artwork/solar-farm-watercolor-cutout.webp" width="1536" height="1024" alt="Watercolor solar farm in Kerala" loading="lazy" style={{opacity:0}}/>}
  {visible&&<svg className="ink-farm-rays" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="#c89b4d" strokeWidth="1.2">{[[500,490],[740,540],[970,565],[1190,545]].map(([x,y],i)=><path key={i} d={`M1350 210 L${x} ${y}`} pathLength="1" style={{animationDelay:`${3.2+i*.35}s`}}/>)}</g></svg>}
 </div>;
}
