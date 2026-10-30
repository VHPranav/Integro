import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { SolarPageLayout } from '@/components/solar-page-layout';
import { BlueprintReveal } from '@/components/blueprint-reveal';

export const metadata: Metadata = {
  title: 'Enquire about a 10 kW+ solar system | Integro',
  description: 'Talk with Integro about a larger than 10 kW solar system for your Kerala home or business.',
};

export default function SolarEnquiryPage() {
  return <SolarPageLayout>
    <main id="top" className="solar-enquiry-page">
      <Link className="solar-back-link" href="/solar-systems"><ArrowLeft size={15} /> Solar system guide</Link>
      <section className="solar-enquiry-card"><div className="solar-enquiry-copy"><span className="solar-guide-kicker">ABOVE ₹26,000 / MONTH · ABOVE 10 kW</span><h1>A larger system <em>starts with your site.</em></h1><p>Share your monthly bill, location and a little about your property. Integro can help plan a capacity after reviewing your roof, usage and any future backup needs.</p><div className="solar-enquiry-points"><p>For homes, businesses and larger rooftops</p><p>Capacity and proposal tailored to your site</p><p>Financing or subsidy questions discussed for your situation</p></div><div className="solar-contact-actions"><a className="button dark" href="tel:+919746905948"><Phone size={16} /> Call +91 97469 05948</a><a className="button solar-whatsapp" href="https://wa.me/919633677945?text=Hello%20Integro%2C%20I%27d%20like%20to%20discuss%20a%20solar%20system%20above%2010%20kW." target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp Integro</a></div><a className="solar-secondary-contact" href="tel:+919633677945">Or call +91 96336 77945 <ArrowUpRight size={14} /></a></div><div className="solar-enquiry-side"><span className="solar-guide-kicker">TO HELP US PREPARE</span><h2>Bring a recent bill<br />and your site location.</h2><p>Roof photos, approximate roof dimensions and any plans for battery backup are helpful for an early conversation.</p><div className="solar-enquiry-art"><BlueprintReveal src="/artwork/solar-home-watercolor-cutout.webp" alt="Watercolor illustration of a solar-powered Kerala home" /></div><div className="solar-enquiry-size"><span>STARTING POINT</span><strong>10 <small>kW</small><i>+</i></strong><span>FINAL CAPACITY AFTER SITE REVIEW</span></div></div></section>
      <p className="solar-enquiry-note">This page opens your phone or WhatsApp app. Integro has not received an enquiry until you choose to call or send a message.</p>
    </main>
  </SolarPageLayout>;
}
