'use client';
import {useEffect,useRef,useState} from 'react';
import {BlueprintReveal} from './blueprint-reveal';

export function CtaArtwork(){
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
 return <div ref={host} className="contact-art"><BlueprintReveal scrub progress={progress} src="/artwork/solar-cta-watercolor-cutout.webp" traceSrc="" alt="Watercolor Kerala courtyard home with terracotta roof and blue solar panels"/></div>;
}
