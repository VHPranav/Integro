'use client';

import {useEffect} from 'react';
import Lenis from 'lenis';

export function SmoothScroll(){
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis:Lenis|null=null;
  const syncDialog=()=>{
   if(document.querySelector('dialog[open]'))lenis?.stop();
   else lenis?.start();
  };
  const setup=()=>{
   lenis?.destroy();
   lenis=media.matches?null:new Lenis({
    autoRaf:true,
    lerp:.085,
    smoothWheel:true,
    anchors:true,
    prevent:node=>Boolean(node.closest('dialog, [popover]')),
   });
   syncDialog();
  };
  setup();
  const observer=new MutationObserver(syncDialog);
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  media.addEventListener('change',setup);
  return()=>{observer.disconnect();media.removeEventListener('change',setup);lenis?.destroy()};
 },[]);
 return null;
}
