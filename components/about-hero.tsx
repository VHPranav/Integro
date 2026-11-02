'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowDown} from 'lucide-react';
import {BlueprintReveal} from '@/components/blueprint-reveal';
import {MotionText} from '@/components/motion-text';

export function AboutHero(){
 const section=useRef<HTMLElement>(null);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{let frame=0;const update=()=>{frame=0;const bounds=section.current?.getBoundingClientRect();if(bounds)setProgress(Math.max(0,Math.min(1,-bounds.top/Math.max(1,bounds.height-window.innerHeight))))};const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};update();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);return()=>{window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);cancelAnimationFrame(frame)}},[]);
 return <section ref={section} className="hero-scroll about-hero" aria-labelledby="about-title"><div className="hero-sticky"><div className="hero-stage"><div className="hero-architecture"><BlueprintReveal progress={progress} src="/artwork/solar-home-watercolor-cutout.webp" alt="A solar-powered Kerala home surrounded by tropical gardens — thoughtful energy for everyday life"/></div><div className="drafting-ruler ruler-top" aria-hidden="true"/><div className="drafting-ruler ruler-bottom" aria-hidden="true"/></div><div className="hero-title-band"><MotionText as="h1" id="about-title">THOUGHTFUL SOLUTIONS.<br/>A BRIGHTER EVERYDAY.</MotionText><div className="hero-description"><MotionText as="p" kind="copy">We are Integro Energy Solutions. Bringing reliable energy, thoughtful engineering and modern infrastructure closer to everyday life.</MotionText></div><a className="hero-discover micro" href="#our-company"><span>MEET<br/>INTEGRO</span><ArrowDown size={20}/></a></div></div></section>;
}
