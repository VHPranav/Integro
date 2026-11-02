'use client';
import {useEffect,useRef,useState} from 'react';
import {BlueprintReveal} from '@/components/blueprint-reveal';

export function ScrollArtwork({src,alt,hero=false}:{src:string;alt:string;hero?:boolean}){
 const host=useRef<HTMLDivElement>(null);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{let frame=0;const update=()=>{frame=0;const node=host.current;if(!node)return;const bounds=node.getBoundingClientRect(),viewport=window.innerHeight;const value=hero?(window.scrollY/Math.max(1,viewport*.55)):(viewport*.9-bounds.top)/Math.max(1,Math.min(bounds.height,viewport)*.8);setProgress(Math.max(0,Math.min(1,value)))};const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};update();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);return()=>{window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);cancelAnimationFrame(frame)}},[hero]);
 return <div ref={host} className="scroll-artwork"><BlueprintReveal src={src} alt={alt} progress={progress} scrub/></div>;
}
