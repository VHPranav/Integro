 'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
import {recommendCapacity} from '@/lib/solar-systems';
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
export function HomeCalculator(){
 const potentialIntro=useRef<HTMLDivElement>(null);
 const [bill,setBill]=useState(4000),[potentialIntroProgress,setPotentialIntroProgress]=useState(0),[potentialStep,setPotentialStep]=useState(0),[reduced,setReduced]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const preference=()=>setReduced(media.matches);preference();media.addEventListener('change',preference);let frame=0;const update=()=>{frame=0;const c=potentialIntro.current?.getBoundingClientRect();if(c)setPotentialIntroProgress(clamp(-(c.top+innerHeight)/Math.max(1,c.height-innerHeight*2)))};const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};update();addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);return()=>{removeEventListener('scroll',queue);removeEventListener('resize',queue);media.removeEventListener('change',preference);cancelAnimationFrame(frame)}},[]);
 useEffect(()=>{const steps=potentialIntro.current?.parentElement?.querySelectorAll<HTMLElement>('.calc-story-step');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setPotentialStep(Number((entry.target as HTMLElement).dataset.step||0))},{rootMargin:'-40% 0px -40% 0px',threshold:0});steps?.forEach(step=>observer.observe(step));return()=>observer.disconnect()},[]);
 const size=recommendCapacity(bill),monthly=(size??0)*120,roof=(size??0)*9,sizeLabel=size?`${size} kW`:'10 kW+';
 const potentialDescription='A first look at the system your home could use, shaped around your energy bill.',potentialWords=potentialDescription.split(' ');
 return (<section id="potential" className="calc-section section-pad" style={{'--bill-pct':`${((bill-1000)/39000*100).toFixed(1)}%`} as React.CSSProperties}>
    <div ref={potentialIntro} className="calc-opening-track" style={{'--opening-progress':potentialIntroProgress} as React.CSSProperties}>
      <div className="calc-opening">
        <div className="calc-opening-frame" aria-hidden="true"><span>+</span><span>+</span><span>+</span><span>+</span></div>
        <h2 className="calc-opening-title">What could your <span className="serif">roof do?</span></h2>
        <p className="calc-opening-description" aria-label={potentialDescription}>{potentialWords.map((word,index)=>{const start=.18+index*.046;const wordProgress=reduced?1:clamp((potentialIntroProgress-start)/.036);return <span key={`${word}-${index}`} aria-hidden="true" style={{opacity:wordProgress,filter:`blur(${(1-wordProgress)*7}px)`,transform:`translateY(${(1-wordProgress)*11}px)`}}>{word}</span>})}</p>
        <div className="calc-opening-ruler" aria-hidden="true"/>
      </div>
    </div>
    <div className="calc-experience">
      <div className="calc-steps">
        <article className={`calc-story-step ${potentialStep===0?'active':''}`} data-step="0">
          <span className="calc-step-index micro">01 / YOUR EVERYDAY</span>
          <h3>Start with what<br/>you use.</h3>
          <p>Your monthly bill gives us a useful first clue. Adjust it to see how the estimate responds.</p>
          <label htmlFor="bill" className="micro calc-input-label">YOUR AVERAGE MONTHLY BILL</label>
          <div className="calc-bill-display" aria-live="polite">₹{bill.toLocaleString('en-IN')}<span>/ month</span></div>
          <div className="calc-slider-wrap"><div className="calc-slider-track" aria-hidden="true"><div className="calc-slider-fill"/><div className="calc-slider-thumb-line"/></div><input id="bill" type="range" min="1000" max="40000" step="500" value={bill} aria-valuetext={`₹${bill.toLocaleString('en-IN')} per month`} onChange={e=>setBill(Number(e.target.value))}/></div>
          <div className="calc-range-labels micro"><span>₹1k</span><span>₹6k</span><span>₹13k</span><span>₹19k</span><span>₹26k</span><span>₹40k</span></div>
        </article>
        <article className={`calc-story-step ${potentialStep===1?'active':''}`} data-step="1">
          <span className="calc-step-index micro">02 / SYSTEM SIZE</span>
          <h3>Make room<br/>for the sun.</h3>
          <p>An indicative system size helps turn your everyday usage into a practical rooftop plan.</p>
          {size?<><div className="calc-inline-result"><strong>{size}<span> kW</span></strong><small>INDICATIVE SYSTEM SIZE</small></div><a className="text-link" href={`/solar-systems/${size}kw`}>Explore the {size} kW guide <ArrowUpRight size={16}/></a></>:<div className="calc-above-ten"><strong>Above 10 kW</strong><p>Your bill falls beyond these starting ranges. Let’s plan a larger system around your property.</p><a className="text-link" href="/solar-systems/enquire">Enquire with Integro <ArrowUpRight size={16}/></a></div>}
        </article>
        <article className={`calc-story-step ${potentialStep===2?'active':''}`} data-step="2">
          <span className="calc-step-index micro">03 / ROOF ALLOWANCE</span>
          <h3>Give it space<br/>to work.</h3>
          <p>Panel layout, access paths, shade and roof shape all matter. This early allowance is a starting point for a site review.</p>
          {size?<div className="calc-inline-result"><strong>{roof}<span> m²</span></strong><small>INDICATIVE ROOF SPACE</small></div>:<a className="text-link" href="/solar-systems/enquire">Discuss your roof space <ArrowUpRight size={16}/></a>}
        </article>
        <article className={`calc-story-step ${potentialStep===3?'active':''}`} data-step="3">
          <span className="calc-step-index micro">04 / ENERGY, ESTIMATED</span>
          <h3>See what<br/>could add up.</h3>
          <p>A rough monthly generation estimate, ready to refine around your roof and the way your home uses power.</p>
          {size?<div className="calc-inline-result"><strong>{monthly}<span> kWh</span></strong><small>ESTIMATED MONTHLY GENERATION</small></div>:<a className="text-link" href="/solar-systems/enquire">Request a site-specific estimate <ArrowUpRight size={16}/></a>}
          <details className="calc-assumptions"><summary className="micro">How this estimate works <Plus size={11}/></summary><p className="calc-assumptions-body">₹8/kWh tariff · 120 kWh/kW/month generation · 9 m²/kW roof allowance. Rounded to 0.5 kW. Not a savings guarantee.</p></details>
          {size?<a href="/calculator" className="button dark calc-story-cta">Explore pricing & EMI <ArrowUpRight size={16}/></a>:<a href="/solar-systems/enquire" className="button dark calc-story-cta">Enquire about 10 kW+ <ArrowUpRight size={16}/></a>}
        </article>
      </div>
      <div className="calc-visual-wrap">
        <div className="calc-visual">
          <div className="calc-visual-labels micro"><span>ROOFTOP SOLAR / KERALA HOME</span><span>PRELIMINARY VIEW</span></div>
          <img src="/artwork/solar-home-watercolor-cutout.webp" width="1536" height="1024" alt="Watercolor illustration of a Kerala home with rooftop solar panels" loading="lazy"/>
          <div className={`calc-visual-callout callout-${potentialStep}`} aria-live="polite"><span className="calc-callout-dot"/><span className="micro">{['MONTHLY BILL','SYSTEM SIZE','ROOF ALLOWANCE','MONTHLY GENERATION'][potentialStep]}</span><strong>{potentialStep===0?`₹${bill.toLocaleString('en-IN')}`:potentialStep===1?sizeLabel:potentialStep===2?(size?`${roof} m²`:'Site review'):size?`${monthly} kWh`:'Enquire'}</strong></div>
          <div className="calc-visual-foot micro"><span>01 — 04</span><span>AN ESTIMATE, MADE PERSONAL</span></div>
        </div>
      </div>
    </div>
  </section>);
}
