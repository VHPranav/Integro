'use client';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
const Scene=dynamic(()=>import('./system-installation'),{ssr:false});
export function SystemScene({system}:{system:number}){const [ready,setReady]=useState(false),ref=useRef<HTMLDivElement>(null);useEffect(()=>{const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){setReady(true);io.disconnect()}},{rootMargin:'300px'});if(ref.current)io.observe(ref.current);return()=>io.disconnect()},[]);return <div className="system-installation" ref={ref}><div className="system-scene-heading"><span>CONFIGURATION / 0{system+1}</span><span>DRAG TO INSPECT ↔</span></div>{ready&&<Scene system={system}/>}<div className="system-scene-key" aria-hidden="true">{(system===0?['ROOFTOP ARRAY','GRID INVERTER','UTILITY METER']:system===1?['ROOFTOP ARRAY','HYBRID INVERTER','BATTERY RESERVE']:['BATTERY RESERVE','BACKUP INVERTER','ESSENTIAL CIRCUITS']).map((s,i)=><span key={s}>0{i+1} / {s}</span>)}</div></div>}
