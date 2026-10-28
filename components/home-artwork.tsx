'use client';
import {useEffect,useRef,useState} from 'react';
import {BlueprintReveal} from './blueprint-reveal';

export function HomeArtwork(){
 const host=useRef<HTMLDivElement>(null);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;
   if(!host.current)return;
   const top=host.current.getBoundingClientRect().top;
   setProgress(Math.max(0,Math.min(1,(innerHeight*.82-top)/(innerHeight*.67))));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[]);
 return <div ref={host} className="home-blueprint"><BlueprintReveal scrub progress={progress} alt="Solar-powered Kerala home, drawn in detailed architectural ink"/></div>;
}
