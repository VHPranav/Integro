'use client';
import {MotionText} from './motion-text';

import {useCallback,useEffect,useId,useRef,useState} from 'react';
import {ArrowUpRight, Moon, RotateCcw, Sun, Unplug} from 'lucide-react';
import dynamic from 'next/dynamic';
const EnergyScene=dynamic(()=>import('./energy-scene'),{ssr:false});

type Point=[number,number,number];
const project=([x,y,z]:Point)=>[590+(x-y)*.74,355+(x+y)*.27-z];
const pts=(points:Point[])=>points.map(p=>project(p).join(',')).join(' ');
const at=(p:Point)=>project(p).join(',');
const segment=(a:Point,b:Point)=>`M${at(a)}L${at(b)}`;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const chapters=[
 {name:'Capture',title:'A roof that puts light to work.',body:'Sunlight reaches the photovoltaic cells. The panel converts that light into direct-current electricity.'},
 {name:'Convert',title:'The connection that makes it useful.',body:'The hybrid inverter manages the system and converts DC electricity into AC power for your home.'},
 {name:'Store',title:'Keep a little daylight for later.',body:'Surplus energy can charge a battery. After sunset, stored energy returns through the inverter to power essential circuits.'},
 {name:'Live',title:'And the ordinary becomes extraordinary.',body:'Power reaches your distribution board and the circuits you use every day. The smallest moment—turning on a light—completes the journey.'}
];

function Box({x,y,z=0,w,d,h,fill='#eeeeE8',children}:{x:number;y:number;z?:number;w:number;d:number;h:number;fill?:string;children?:React.ReactNode}){
 return <g className="workshop-solid"><polygon points={pts([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]])} fill="#f7f7f2"/><polygon points={pts([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]])} fill={fill}/><polygon points={pts([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]])} fill="#d6d8cf"/>{children}</g>
}
function Cable({d,id,active,reverse=false,progress=1}:{d:string;id:string;active:boolean;reverse?:boolean;progress?:number}){
 return <g className={`workshop-cable ${active?'powered':''}`}><path d={d} className="cable-sheath"/><path d={d} pathLength="1" className="cable-core" style={{strokeDashoffset:1-progress}}/><path d={d} id={id} className="cable-guide"/>{active&&[0,1,2].map(i=><circle key={i} r="2.5" className="cable-pulse"><animateMotion dur="4s" begin={`${i*-1.33}s`} repeatCount="indefinite" keyPoints={reverse?'1;0':'0;1'} keyTimes="0;1" calcMode="linear"><mpath href={`#${id}`}/></animateMotion></circle>)}</g>
}

export function EnergyFlow({night,onToggle}:{night:boolean;onToggle:()=>void}){
 const id=useId().replace(/:/g,'');
 const root=useRef<HTMLDivElement>(null);
 const [sunlight,setSunlight]=useState(80),[outage,setOutage]=useState(false),[active,setActive]=useState(0),[manual,setManual]=useState(false),[progress,setProgress]=useState(0),[sceneReady,setSceneReady]=useState(false),[sceneEnabled,setSceneEnabled]=useState(false),[resetVersion,setResetVersion]=useState(0);
 useEffect(()=>{const el=root.current;if(!el)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setSceneEnabled(true);observer.disconnect()}},{rootMargin:"300px"});observer.observe(el);return()=>observer.disconnect()},[]);
 const markReady=useCallback(()=>setSceneReady(true),[]),markUnavailable=useCallback(()=>setSceneReady(false),[]);
 useEffect(()=>{let frame=0;const update=()=>{frame=0;const box=root.current?.getBoundingClientRect();if(!box)return;const p=clamp((innerHeight*.8-box.top)/(box.height+innerHeight*.1));setProgress(p);if(!manual)setActive(Math.min(3,Math.floor(p*4)))};const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};update();addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);return()=>{removeEventListener('scroll',scroll);removeEventListener('resize',scroll);cancelAnimationFrame(frame)}},[manual]);
 const load=.8,potentialSolar=night?0:sunlight*.04,solar=outage?Math.min(potentialSolar,load+1.8):potentialSolar,battery=Math.max(-load,Math.min(1.8,solar-load)),grid=outage?0:Math.max(0,solar-load-battery),lit=progress>.08;
 const solarCable=`M${at([-190,100,65])} C 382 320 315 346 394 370 S 480 314 548 340 S 588 347 ${at([-30,-65,20])}`;
 const batteryCable=`M${at([20,-65,20])} C 665 395 731 440 644 461 S 473 447 503 408 Q 518 393 ${at([65,130,95])}`;
 const lightCable=`M${at([80,-65,25])} C 748 355 705 389 777 415 S 938 381 940 434 S 850 506 ${at([360,30,15])}`;
 const gridCable=`M${at([470,-150,45])} C 1053 425 1116 421 1079 469 S 968 494 957 464 S 949 382 855 371 S 755 326 ${at([80,-90,40])}`;
 function reset(){setResetVersion(v=>v+1);setSunlight(80);setOutage(false);setManual(false);setActive(0);if(night)onToggle()}
 return <div ref={root} className={`energy-workshop ${night?'workshop-night':''} ${outage?'workshop-island':''}`}>
 <div className="workshop-topbar"><button onClick={reset} aria-label="Reset energy workshop"><RotateCcw size={13}/> RESET</button></div>
 <div className="workshop-main">
 <div className={`workshop-scene ${sceneReady?'has-real-scene':''}`}>
 {sceneEnabled&&<EnergyScene night={night} sunlight={sunlight} outage={outage} solar={solar} battery={battery} grid={grid} lit={lit} active={active} resetVersion={resetVersion} onReady={markReady} onUnavailable={markUnavailable}/>}

 
 <svg viewBox="0 0 1200 650" className="workshop-svg" role="img" aria-hidden={sceneReady} aria-label={`Isometric solar energy workshop. ${night?'At night, the battery supplies the inverter and a working lamp.':'Sunlight powers the solar panel, hybrid inverter, battery and lamp.'} ${outage?'The grid is isolated and the battery-backed system continues supplying essential loads.':''}`}>
 <defs><pattern id={`${id}hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><path d="M0 0V5" stroke="#45483f" strokeWidth=".35" opacity=".4"/></pattern><pattern id={`${id}grain`} width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".4" fill="#575c4d" opacity=".28"/><circle cx="7" cy="7" r=".25" fill="#575c4d" opacity=".25"/></pattern><radialGradient id={`${id}glow`}><stop stopColor="#fff" stopOpacity="1"/><stop offset=".45" stopColor="#fff" stopOpacity=".5"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient><radialGradient id={`${id}shadow`}><stop stopColor="#3b3e34" stopOpacity=".13"/><stop offset="1" stopColor="#3b3e34" stopOpacity="0"/></radialGradient></defs>
 <g transform="translate(60 25) scale(.9)">
 <ellipse cx="600" cy="502" rx="560" ry="125" fill={`url(#${id}shadow)`}/>
 <g stroke="#73776b" strokeWidth=".7" strokeLinejoin="round" fill="none">
 <Box x={-530} y={-210} z={-20} w={1050} d={490} h={20} fill="#e8eae2"/>
 <polygon points={pts([[-530,-210,0],[520,-210,0],[520,280,0],[-530,280,0]])} fill={`url(#${id}grain)`} stroke="none"/>
 <g stroke="#c8ccbe" strokeWidth=".45" opacity=".65">{Array.from({length:12},(_,i)=><path key={`x${i}`} d={segment([-510+i*90,-195,.5],[-510+i*90,265,.5])}/>)}{Array.from({length:6},(_,i)=><path key={`y${i}`} d={segment([-515,-190+i*90,.5],[505,-190+i*90,.5])}/>)}</g>
 <g className={`workshop-sun ${night?'sun-asleep':''}`} style={{opacity:night?0:1}} transform="translate(265 60)"><circle r="27" stroke="#50564a"/><ellipse rx="13" ry="27"/><ellipse rx="27" ry="9"/>{Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <path key={i} d={`M${Math.cos(a)*34},${Math.sin(a)*34}L${Math.cos(a)*42},${Math.sin(a)*42}`}/>})}</g>
 <g className="workshop-moon" opacity={night?1:0} transform="translate(265 60)"><circle r="27" fill="#d2d3cf"/><circle cx="-8" cy="-7" r="6" fill="#aaada4"/><circle cx="10" cy="8" r="8" fill="#b9bdb2"/><circle cx="-10" cy="12" r="3" fill="#969c8c"/></g>
 <g className="workshop-rays" opacity={night?0:.15+sunlight/200}>{[0,1,2,3,4].map(i=><path key={i} d={`M${248+i*13} 110 L${270+i*29} ${170+i*4}`} pathLength="1"/>)}</g>
 <g>{[-425,-210].flatMap(x=>[-110,90].map(y=><path key={`${x}${y}`} d={segment([x,y,0],[x,y,92-y*.3])} strokeWidth="2"/>))}<path d={segment([-425,-110,10],[-210,90,10])+segment([-425,90,10],[-210,-110,10])} stroke="#a1a797"/></g>
 <g className={`workshop-device ${active===0?'device-active':''}`} onPointerEnter={()=>setActive(0)}><polygon points={pts([[-450,-130,129],[-190,-130,129],[-190,110,57],[-450,110,57]])} fill="#d9ddd2" strokeWidth="1.1"/><polygon points={pts([[-450,110,49],[-190,110,49],[-190,110,57],[-450,110,57]])} fill="#b7bead"/>{Array.from({length:48},(_,i)=>{const x=-441+(i%6)*42,y=-121+Math.floor(i/6)*28,z=90-y*.3;return <g key={i}><polygon points={pts([[x,y,z],[x+38,y,z],[x+38,y+24,z-7.2],[x,y+24,z-7.2]])} fill={`url(#${id}hatch)`} stroke="#686f5e" strokeWidth=".5"/>{[12,25].map(d=><path key={d} d={segment([x+d,y,z+.4],[x+d,y+24,z-6.8])} stroke="#f8f9f4" strokeWidth=".8"/>)}</g>})}<path d={segment([-448,-128,129],[-188,-128,129])+segment([-188,-128,129],[-188,112,57])} stroke="#fdfef9" strokeWidth="2"/></g>
 <Cable d={solarCable} id={`${id}solar`} active={solar>0&&lit} progress={clamp(progress*3)}/>
 <Cable d={batteryCable} id={`${id}battery`} active={Math.abs(battery)>.01&&lit} reverse={battery<0} progress={clamp(progress*3-.3)}/>
 <Cable d={lightCable} id={`${id}light`} active={lit} progress={clamp(progress*3-.6)}/>
 <Cable d={gridCable} id={`${id}grid`} active={grid>.01&&lit} reverse progress={clamp(progress*3-.8)}/>
 <g className={`workshop-device ${active===1?'device-active':''}`} onPointerEnter={()=>setActive(1)}>
 <Box x={-45} y={-135} z={0} w={140} d={80} h={10} fill="#c7cdbd"/>
 <Box x={-30} y={-125} z={10} w={110} d={60} h={210} fill="#eeefe8"/>
 <polygon points={pts([[-18,-64,155],[65,-64,155],[65,-64,200],[-18,-64,200]])} fill="#343a2e"/>
 <path d={segment([-8,-63,172],[10,-63,172])+segment([17,-63,172],[28,-63,172])+segment([35,-63,172],[54,-63,172])} stroke="#e9ece1" strokeWidth="2.3"/>
 {Array.from({length:7},(_,i)=><path key={i} d={segment([-12,-64,60+i*8],[58,-64,60+i*8])} stroke="#a0a892"/>)}
 <circle cx={project([24,-64,133])[0]} cy={project([24,-64,133])[1]} r="2" fill="#525e43" stroke="none"/>
 <path d={segment([79,-110,35],[79,-74,35])+segment([79,-110,44],[79,-74,44])} stroke="#868f79"/>
 <g strokeWidth="1.8"><path d={segment([-13,-65,10],[-13,-65,0])+segment([15,-65,10],[15,-65,0])+segment([44,-65,10],[44,-65,0])}/></g>
 </g>
 <g className={`workshop-device ${active===2?'device-active':''}`} onPointerEnter={()=>setActive(2)}><Box x={-30} y={105} z={0} w={140} d={80} h={8} fill="#c4cbb9"/><Box x={-20} y={115} z={8} w={120} d={60} h={122} fill="#ebeee3"/>
 <polygon points={pts([[-8,176,90],[87,176,90],[87,176,117],[-8,176,117]])} fill="#32392a"/>
 {[0,1,2,3,4,5].map(i=><path key={i} d={segment([i*13-1,177,100],[i*13+6,177,100])} stroke={i<4?'#eff2e8':'#6c775f'} strokeWidth="4"/>)}
 {Array.from({length:4},(_,i)=><path key={i} d={segment([-5,176,35+i*10],[83,176,35+i*10])} stroke="#b6bfaa"/>)}
 <path d={segment([18,175,131],[18,175,143])+segment([18,175,143],[62,175,143])+segment([62,175,143],[62,175,131])} strokeWidth="2"/>
 </g>
 <g className={`workshop-device ${active===3?'device-active':''}`} onPointerEnter={()=>setActive(3)}>
 <ellipse cx={project([360,30,0])[0]} cy={project([360,30,0])[1]} rx="48" ry="16" fill="#d6dcca"/>
 <ellipse cx={project([360,30,7])[0]} cy={project([360,30,7])[1]} rx="48" ry="16" fill="#f0f2e9"/>
 <path d={`M${at([360,30,7])} L${at([360,30,267])} Q 832 143 871 160 L886 178`} strokeWidth="4" stroke="#68725a"/>
 <path d="M886 178v35" strokeWidth="1.2"/>
 <path d="M877 210Q873 232 846 248Q885 266 927 248Q902 231 895 210Z" fill="#eef0e7" strokeWidth="1"/>
 <ellipse cx="886" cy="248" rx="40" ry="12" fill={lit?'#fff':'#c6ceba'}/>
 <path d="M862 253L789 442Q886 494 987 442L909 253" fill={`url(#${id}glow)`} stroke="none" className={`workshop-light ${lit?'light-on':''}`}/>
 <ellipse cx="886" cy="444" rx="98" ry="33" fill={`url(#${id}glow)`} stroke="none" className={`workshop-light ${lit?'light-on':''}`}/>
 <path d="M880 249q6 17 12 0" stroke={lit?'#5b6450':'#a5ae98'} strokeWidth="1.5"/>
 </g>
 <g className={outage?'grid-disconnected':''}>
 <Box x={438} y={-185} z={0} w={78} d={50} h={8}/><Box x={450} y={-178} z={8} w={50} d={30} h={100}/><polygon points={pts([[459,-147,64],[490,-147,64],[490,-147,89],[459,-147,89]])} fill="#d0d7c5"/>
 <path d={segment([475,-146,36],[475,-146,54])} strokeWidth="2" style={{transform:outage?'translate(4px,-3px) rotate(12deg)':'none',transformOrigin:`${at([475,-146,36])}`}}/>
 </g>
 <g className="workshop-labels" stroke="none" fill="#62685a" fontFamily="Courier New, monospace" fontSize="10"><text x="255" y="327">01 / SOLAR ARRAY</text><text x="679" y="65">02 / INVERTER</text><text x="420" y="495">03 / STORAGE</text><text x="936" y="165">04 / EVERYDAY LIFE</text><text x="1020" y="285" textAnchor="middle">GRID</text><text x="1018" y="298" textAnchor="middle" fontSize="8">{outage?'ISOLATED':'CONNECTED'}</text></g>
 <g stroke="#9aa18e" strokeWidth=".5" strokeDasharray="3 5"><path d="M270 312L284 288M694 73v25M458 480l16-23M933 174l-29 38"/></g>
 </g>
 </g>
 </svg>
 <span className="workshop-move micro">DRAG TO EXPLORE ↔</span>
 </div>
 <aside className="workshop-controls">
 <button className="workshop-mode" aria-pressed={night} onClick={onToggle}>{night?<Moon size={17} strokeWidth={1}/>:<Sun size={17} strokeWidth={1}/>}<span>{night?'Night mode':'Day mode'}<small>{night?'Stored energy takes over':'The roof is generating'}</small></span><span className="toggle"><i/></span></button>
 <div className="workshop-sunlight"><label htmlFor={`${id}sunlight`} className="micro">SUNLIGHT <span>{night?'0':sunlight}%</span></label><input id={`${id}sunlight`} aria-label="Sunlight intensity" type="range" min="0" max="100" step="5" value={night?0:sunlight} disabled={night} onChange={e=>setSunlight(Number(e.target.value))}/><div className="micro sunlight-range"><span>OVERCAST</span><span>CLEAR SKY</span></div></div>
 <button className={`workshop-outage ${outage?'is-active':''}`} aria-pressed={outage} onClick={()=>setOutage(!outage)}><Unplug size={15} strokeWidth={1}/><span>{outage?'Restore the grid':'Try a grid outage'}</span><ArrowUpRight size={14}/></button>
 <div className="workshop-readouts"><span className="micro">ILLUSTRATIVE / 4 KW ARRAY</span><dl><div><dt>Solar generation</dt><dd>{solar.toFixed(1)} <small>kW</small></dd></div><div><dt>Essential loads</dt><dd>{load.toFixed(1)} <small>kW</small></dd></div><div><dt>{battery>=0?'Charging storage':'From storage'}</dt><dd>{Math.abs(battery).toFixed(1)} <small>kW</small></dd></div><div><dt>{outage?'Grid connection':'Surplus to grid'}</dt><dd>{outage?'OFF':grid.toFixed(1)} {!outage&&<small>kW</small>}</dd></div></dl><MotionText as="p" kind="copy">{outage?'The grid is isolated. This battery-backed hybrid example keeps its essential circuits supplied.':night?'The sun has set. Energy stored earlier now supports the home.':'The roof supplies the home first, then storage. Any remaining surplus can flow to the grid.'}</MotionText></div>
 </aside></div>
 <div className="workshop-story"><div className="workshop-chapters" aria-label="Explore the energy journey">{chapters.map((c,i)=><button key={c.name} aria-pressed={active===i} onClick={()=>{setActive(i);setManual(true)}}><span>0{i+1}</span>{c.name}<i/></button>)}</div><div className="workshop-inspector" aria-live="polite"><MotionText as="h3">{chapters[active].title}</MotionText><MotionText as="p" kind="copy">{chapters[active].body}</MotionText></div></div>
 
 </div>
}
