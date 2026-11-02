'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand } from '@/components/brand';

export function SolarPageHeader() {
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = window.scrollY;
      if (Math.abs(current - previous) < 7) return;
      if (menu || current < 100 || current < previous) setHidden(false);
      else if (current > 150) setHidden(true);
      previous = current;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [menu]);
  return (
    <header className={`header solar-page-header ${hidden && !menu ? 'is-hidden' : ''}`} inert={hidden && !menu}>
      <a href="/" aria-label="Integro home"><Brand /></a>
      <nav aria-label="Main navigation" className={menu ? 'open' : ''}>
        <a href="/about" onClick={() => { setMenu(false); setHidden(false); }}>About us</a>
        <a href="/services" onClick={() => { setMenu(false); setHidden(false); }}>Services</a>
        <a href="/solar-systems" onClick={() => setMenu(false)}>Solar systems</a>
        <a href="https://wa.me/919746905948?text=Hello%20Integro%2C%20I%20would%20like%20to%20discuss%20solar%20for%20my%20property." target="_blank" rel="noopener noreferrer" className="nav-cta" onClick={() => { setMenu(false); setHidden(false); }}>Let’s talk solar <ArrowUpRight size={16} /></a>
      </nav>
      <button className="menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </header>
  );
}
