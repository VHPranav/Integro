'use client';

import {Children,cloneElement,isValidElement,useEffect,useRef,useState,type CSSProperties,type HTMLAttributes,type ReactNode,createElement} from 'react';

type Tag='h1'|'h2'|'h3'|'p'|'span';
type Props=HTMLAttributes<HTMLElement>&{as?:Tag;kind?:'heading'|'copy'|'label';delay?:number;children:ReactNode};
function plainText(children:ReactNode):string{return Children.toArray(children).map(child=>{if(typeof child==='string'||typeof child==='number')return String(child);if(isValidElement<{children?:ReactNode}>(child)){if(child.type==='br')return ' ';return plainText(child.props.children)}return ''}).join('')}

/** Masked word entrances retain their original semantic tag and accessible name. */
export function MotionText({as='h2',kind='heading',delay=0,children,className='',style,...rest}:Props){
 const root=useRef<HTMLElement>(null),[armed,setArmed]=useState(false),[visible,setVisible]=useState(false);
 const text=plainText(children);
 useEffect(()=>{
  const el=root.current;if(!el)return;const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  if(media.matches){setArmed(false);setVisible(true);return;}
  setArmed(true);setVisible(false);
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect()}},{threshold:.08,rootMargin:'0px 0px -7% 0px'});
  frame=requestAnimationFrame(()=>observer.observe(el));
  const preference=()=>{if(media.matches){setArmed(false);setVisible(true);observer.disconnect()}};media.addEventListener('change',preference);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();media.removeEventListener('change',preference)};
 },[text]);
 let word=0;
 function split(nodes:ReactNode):ReactNode{return Children.map(nodes,(child,index)=>{
  if(typeof child==='string'||typeof child==='number')return String(child).split(/(\s+)/).map((part,i)=>{if(!part||/^\s+$/.test(part))return part;const n=word++;return <span className="text-word" aria-hidden="true" key={`${index}-${i}`}><span className="text-word-inner" style={{'--word-index':Math.min(n,18)} as CSSProperties}>{part}</span></span>});
  if(isValidElement<{children?:ReactNode}>(child)&&typeof child.type==='string'&&child.props.children!==undefined)return cloneElement(child,{},split(child.props.children));
  return child;
 })}
 return createElement(as,{...rest,ref:root,className:`motion-text motion-${kind} ${className}`,'data-motion-armed':armed,'data-motion-visible':visible,'aria-label':kind==='heading'?text:rest['aria-label'],style:{'--text-delay':`${delay}s`,...style} as CSSProperties},kind==='heading'?split(children):children);
}
