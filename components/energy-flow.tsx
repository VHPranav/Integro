'use client';
import {Sun, Zap, Battery, Lightbulb, UtilityPole, SlidersHorizontal} from 'lucide-react';
export function EnergyFlow({night,onToggle}:{night:boolean;onToggle:()=>void}) {return <div className={`flow-illustration ${night?'night':''}`}>
 <div className="flow-mode"><span className="micro">SYSTEM VIEW / HYBRID</span><button onClick={onToggle} aria-pressed={night}>{night?'Night mode':'Day mode'} <span className="toggle"><i/></span></button></div>
 <div className="flow-grid">
 <div className="flow-node solar-node"><Sun size={39} strokeWidth={1}/><span>01 / SOLAR ARRAY</span><small>{night?'Sunlight unavailable':'Sunlight → DC electricity'}</small></div>
 <div className="flow-wire horizontal"><i/></div>
 <div className="flow-node inverter-node"><SlidersHorizontal size={39} strokeWidth={1}/><span>02 / HYBRID INVERTER</span><small>DC → usable AC power</small></div>
 <div className="flow-wire horizontal"><i/></div>
 <div className="flow-node home-node"><Lightbulb size={39} strokeWidth={1} className="bulb"/><span>03 / YOUR HOME</span><small>Distribution board → lights</small></div>
 <div className="flow-branch"><span/><div className="flow-node battery-node"><Battery size={39} strokeWidth={1}/><span>BATTERY STORAGE</span><small>{night?'Supplying stored energy':'Storing surplus energy'}</small></div></div>
 <div className="grid-branch"><UtilityPole size={28} strokeWidth={1}/><span>GRID CONNECTION</span><small>Via metering & protection</small></div>
 </div><div className="flow-caption"><Zap size={13}/><span>{night?'Stored during the day. Ready after sunset.':'One connected system. Every component with a purpose.'}</span></div>
 </div>}
