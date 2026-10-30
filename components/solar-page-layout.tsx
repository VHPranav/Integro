import { ArrowUpRight } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SolarPageHeader } from '@/components/solar-page-header';

export function SolarPageLayout({ children }: { children: React.ReactNode }) {
  return <>
    <SolarPageHeader />
    {children}
    <footer className="site-footer solar-page-footer">
      <div className="solar-page-footer-top"><a href="/" aria-label="Integro home"><Brand /></a><p>Solar, thoughtfully connected<br />for Kerala homes and businesses.</p></div>
      <div className="solar-page-footer-links"><a href="/solar-systems">Explore solar systems <ArrowUpRight size={14} /></a><a href="/solar-systems/enquire">Enquire about your project <ArrowUpRight size={14} /></a><a href="tel:+919746905948">+91 97469 05948 <ArrowUpRight size={14} /></a></div>
      <div className="footer-bottom micro"><span>© {new Date().getFullYear()} INTEGRO</span><a className="footer-credit" href="https://www.outriftmedia.com/" target="_blank" rel="noopener noreferrer">Powered by Outrift Media <ArrowUpRight size={14} /></a><a href="#top">BACK TO TOP ↑</a></div>
    </footer>
  </>;
}
