'use client';
import { useId } from 'react';
type Point = [number, number, number];
export function SolarModel({progress=0, exploded=0, compact=false}:{progress?:number;exploded?:number;compact?:boolean}){
 const id=useId().replace(/:/g,'');
 const a=-0.12+progress*.25;
 const project=([x,y,z]:Point)=>{const u=x*Math.cos(a)-y*Math.sin(a),v=x*Math.sin(a)+y*Math.cos(a);return [410+u*.88+v*.53,330-u*.28+v*.45-z];};
 const poly=(p:Point[])=>p.map(v=>project(v).map(n=>n.toFixed(2)).join(',')).join(' ');
 const rect=(x:number,y:number,w:number,h:number,z:number)=>poly([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]]);
 const line=(p:Point,q:Point)=>{const s=project(p),e=project(q);return `M${s}L${e}`};
 const layers=[{z:0,fill:'#e0e1db',name:'back'},{z:10+exploded*43,fill:'#f7f7f2',name:'encapsulation'},{z:18+exploded*88,fill:'#c8ccc5',name:'cells'},{z:26+exploded*140,fill:'#f6f6f1',name:'glass'}];
 return <svg viewBox="0 0 820 650" className="solar-model" role="img" aria-label="Three dimensional solar panel, separating into its glass, cells and protective layers as you scroll">
 <defs><pattern id={`${id}hatch`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M0 0V4" stroke="#53594d" strokeWidth=".35" opacity=".35"/></pattern><radialGradient id={`${id}shadow`}><stop stopColor="#3e4435" stopOpacity=".12"/><stop offset="1" stopColor="#3e4435" stopOpacity="0"/></radialGradient></defs>
 {!compact&&<g stroke="#a3a69b" fill="none" strokeWidth=".6" opacity=".45">{Array.from({length:11},(_,i)=><path key={i} d={line([-380,-350+i*70,-85],[380,-350+i*70,-85])}/>)}{Array.from({length:11},(_,i)=><path key={i} d={line([-350+i*70,-380,-85],[-350+i*70,380,-85])}/>)}</g>}
 <ellipse cx="410" cy="467" rx="290" ry="95" fill={`url(#${id}shadow)`}/>
 <g stroke="#454b40" strokeWidth=".8" strokeLinejoin="round">
 <path d={line([-135,160,-10],[-135,160,-76])+line([135,160,-10],[135,160,-76])+line([-135,-160,-10],[-135,-160,-76])+line([135,-160,-10],[135,-160,-76])} fill="none"/>
 <polygon points={poly([[-182,-232,-8],[182,-232,-8],[182,232,-8],[-182,232,-8]])} fill="#ebede6"/>
 <polygon points={poly([[-182,232,-8],[182,232,-8],[182,232,0],[-182,232,0]])} fill="#bfc4b9"/>
 {layers.map((l,k)=><g key={l.name}>
 <polygon points={rect(-180,-230,360,460,l.z)} fill={l.fill} fillOpacity={k===3?.12:1}/>
 {k===2&&<g>{Array.from({length:60},(_,i)=>{const x=-171+(i%6)*57,y=-220+Math.floor(i/6)*44;return <g key={i}><polygon points={poly([[x+3,y,l.z+.2],[x+50,y,l.z+.2],[x+54,y+4,l.z+.2],[x+54,y+38,l.z+.2],[x+50,y+42,l.z+.2],[x+3,y+42,l.z+.2],[x,y+38,l.z+.2],[x,y+4,l.z+.2]])} fill={`url(#${id}hatch)`} stroke="#6d7466" strokeWidth=".55"/>{[13,27,41].map(d=><path key={d} d={line([x+d,y+1,l.z+.4],[x+d,y+41,l.z+.4])} stroke="#f6f7f1" strokeWidth="1.2"/>)}</g>})}</g>}
 {k===3&&<><polygon points={rect(-185,-235,370,470,l.z)} fill="none" strokeWidth="1.4"/><polygon points={rect(-175,-225,350,450,l.z)} fill="none" strokeWidth=".5"/><path d={line([-175,155,l.z],[90,-225,l.z])+line([-145,225,l.z],[175,-155,l.z])} stroke="#fff" strokeWidth="8" opacity=".5"/></>}
 </g>)}
 {exploded>.1&&<g strokeDasharray="3 5" opacity=".45">{[[-180,-230],[180,-230],[-180,230],[180,230]].map(([x,y],i)=><path key={i} d={line([x,y,0],[x,y,26+exploded*140])}/>)}</g>}
 <polygon points={rect(-30,238,60,26,-5)} fill="#747b6b"/>
 </g>
 {!compact&&<g fill="none" stroke="#53594b"><path d={`M${project([0,262,-5])} C 510 490, 610 480, 593 534 S 420 520, 466 594 L466 650`} strokeWidth="1.7"/><path d={`M${project([14,262,-5])} C 550 480, 653 521, 590 559 S 470 557, 486 618 L486 650`} strokeWidth=".6"/><circle cx="466" cy="613" r="4" fill="#444b3b" className="energy-dot"/></g>}
 </svg>
}

export function House({lit=false}:{lit?:boolean}){return <svg viewBox="0 0 760 500" role="img" aria-label="Architectural drawing of a Kerala home powered by solar" className={`house-model ${lit?'lit':''}`}><defs><pattern id="roof-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><path d="M0 0V9" stroke="#6b7066" strokeWidth=".45"/></pattern><radialGradient id="lamp-glow"><stop stopColor="white"/><stop offset="1" stopColor="#f4f4ee" stopOpacity="0"/></radialGradient></defs><g fill="none" stroke="#d6d8ce" strokeWidth=".6">{Array.from({length:13},(_,i)=><path key={i} d={`M${i*60-100} 500l430-250M${i*60-100} 250l430 250`}/>)}</g><g stroke="#535a4d" strokeWidth="1" strokeLinejoin="round"><path d="M113 366l314 95 237-138-314-94z" fill="#e9ebe3"/><path d="M142 242v115l270 84V286z" fill="#f9f9f4"/><path d="M412 286v155l217-125V164z" fill="#efefe8"/><path d="M115 245l119-140 315 90-137 110z" fill="url(#roof-hatch)"/><path d="M234 105l209-76 212 141-106 25z" fill="#f6f6ef"/><path d="M115 245v9l297 93 243-169v-8M412 305v42" fill="none"/><path d="M172 286v63l62 19v-63zM265 314v65l78 24v-65z" fill="#dfe3d6"/><path d="M192 292v64m22-57v62m71-41v65m20-58v64m18-58v64"/><path d="M461 293v94l65-38v-94z" fill="#dce0d5"/><path d="M552 241v64l49-28v-64z" fill="#dce0d5"/><path d="M576 227v64m-24-17 49-29M493 274v93"/><path d="M136 254v110m270-19v95m227-248v132" strokeWidth="4"/><path d="M177 196l54-65 204 58-59 69z" fill="#b9c0af"/>{Array.from({length:7},(_,i)=><path key={i} d={`M${185+i*30} ${198+i*9}l54-65`}/>)}{Array.from({length:4},(_,i)=><path key={i} d={`M${190+i*12} ${181-i*14}l204 58`}/>)}<path d="M366 268v35q0 12 20 18v76h53" strokeWidth="2" fill="none"/><path d="M436 345v50l24-14v-50z" fill="#f8f9f3"/><path d="M448 341v-16l44-26v-22" fill="none"/><path d="M479 282l13-14 12 1-12 18z" fill="#5c6452"/><ellipse cx="494" cy="309" rx="45" ry="27" fill="url(#lamp-glow)" stroke="none" className="lamp-light"/><path d="M118 371l295 91 249-144M116 378l297 90 249-143" fill="none"/><path d="M88 345q-15-60-3-139m-2 40q-35-34-57-9m59-11q-31-43-58-32m58 29q28-42 56-25m-56 14q11-61 42-53m-43 47q-18-58-45-57" fill="none"/><path d="M679 309V211m0 35q-32-40-48-18m48 5q17-39 42-25m-42 17q-10-43-24-45" fill="none"/></g></svg>}
