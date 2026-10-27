'use client';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
const Scene=dynamic(()=>import('./system-installation'),{ssr:false});
export function SystemScene({system}:{system:number}){const [ready,setReady]=useState(false),ref=useRef<HTMLDivElement>(null);useEffect(()=>{const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){setReady(true);io.disconnect()}},{rootMargin:'300px'});if(ref.current)io.observe(ref.current);return()=>io.disconnect()},[]);return <div className="system-installation" ref={ref}>{ready&&<Scene system={system}/>}</div>}
