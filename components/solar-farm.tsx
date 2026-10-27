'use client';
import {useEffect,useRef,useState} from 'react';
import {BlueprintReveal} from './blueprint-reveal';
export function SolarFarm(){
 const host=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){setVisible(true);io.disconnect()}},{threshold:.2});if(host.current)io.observe(host.current);return()=>io.disconnect()},[]);
 return <div ref={host} className="solar-farm solar-farm-image">{visible?<BlueprintReveal src="/artwork/solar-farm-ink.webp" traceSrc="/artwork/solar-farm-trace.json" alt="Detailed architectural pen-and-ink illustration of a solar farm in Kerala, with rows of photovoltaic panels, palms and fine rays of sunlight"/>:<img src="/artwork/solar-farm-ink.webp" width="1536" height="1024" alt="Solar farm architectural ink illustration" loading="lazy" style={{opacity:0}}/>}{visible&&<svg className="ink-farm-rays" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="#73776c" strokeWidth="1.2">{[[500,490],[740,540],[970,565],[1190,545]].map(([x,y],i)=><path key={i} d={`M1350 210 L${x} ${y}`} pathLength="1" style={{animationDelay:`${3.2+i*.35}s`}}/>)}</g></svg>}</div>
}
