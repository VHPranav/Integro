import {CalculatorExperience} from '@/components/calculator-experience';
import {MotionText} from '@/components/motion-text';
import {SystemOptions} from '@/components/system-options';
import {PanelStory} from '@/components/panel-story';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SolarPageLayout } from '@/components/solar-page-layout';
import { BlueprintReveal } from '@/components/blueprint-reveal';
import { equipmentBrands, solarSystems, supportedBanks } from '@/lib/solar-systems';

export const metadata: Metadata = {
  title: 'Solar systems for Kerala homes | Integro',
  description: 'Explore an initial rooftop solar capacity based on your monthly electricity bill, then refine it with Integro around your roof and energy use.',
};

export default function SolarSystemsPage() {
  return <SolarPageLayout>
    <main id="top" className="solar-guide-page solar-overview">
      <section className="services-hero solar-overview-hero"><div className="services-hero-art"><BlueprintReveal src="/artwork/services-solar.webp" alt="Blue rooftop solar panels on a Kerala home, illustrated in watercolor"/></div><div className="services-hero-copy"><MotionText as="h1">Your roof.<br/>A brighter possibility.</MotionText><div><p>A solar system shaped around your space, energy use and everyday life. Discover the connection that works for you.</p><a className="text-link" href="#capacity-guide">Find your system <ArrowRight size={18}/></a></div></div></section>
      <nav className="solar-overview-nav" aria-label="Solar guide sections"><a href="#solutions">System types <ArrowRight size={16}/></a><a href="#capacity-guide">Capacity guide <ArrowRight size={16}/></a><a href="#anatomy">Inside the panel <ArrowRight size={16}/></a><Link href="/solar-systems#calculator">Pricing & EMI <ArrowUpRight size={16}/></Link></nav>
      <PanelStory/>


      <SystemOptions/>

      <section id="capacity-guide" className="capacity-guide">
        <div className="solar-page-heading"><h2>A system that fits<br /><em>the way you live.</em></h2><p>Choose the range closest to your monthly bill. These capacities are starting recommendations; a site visit and bill review confirm the right system.</p></div>
        <div className="solar-size-list">{solarSystems.map(system=><Link key={system.slug} href={`/solar-systems/${system.slug}`} className="solar-size-row"><strong>{system.capacity}<small> kW</small></strong><div><span>Monthly electricity bill</span><p>{system.billRange.replace(' / month','')}</p></div><div><span>Indicative system price</span><p>{system.price}</p></div><span className="solar-size-action">Explore <ArrowUpRight size={19}/></span></Link>)}</div>
        <div className="capacity-custom"><div><span className="solar-guide-kicker">ABOVE ₹26,000 / MONTH</span><h3>Need more than 10 kW?</h3><p>We’ll look at the property, your usage and future plans, then help you explore a larger system.</p></div><Link className="button dark" href="/solar-systems/enquire">Enquire with us <ArrowUpRight size={17} /></Link></div>
        <p className="solar-disclaimer">Monthly generation and roof area are indicative planning allowances. Actual output and layout depend on location, season, shading, roof access and equipment. Final capacity and price follow a site review and written proposal.</p>
      </section>

      <div id="calculator" className="solar-embedded-calculator"><CalculatorExperience compact/></div>

      <section className="solar-practical section-pad"><div><h2>Considered down<br/><span className="serif">to the details.</span></h2><p>Equipment, installation and support, brought together around your property.</p></div><div className="solar-practical-details"><details><summary>Equipment & brands <span>+</span></summary><p>Final equipment depends on compatibility, availability and your system design.</p><div className="solar-inline-brands">{equipmentBrands.map(brand=><span key={brand}>{brand}</span>)}</div></details><details><summary>Installation & aftercare <span>+</span></summary><p>Capacity planning, professional installation, electrical checks and aftercare are considered together. Your site and bill review guide the final proposal.</p></details><details><summary>Financing & eligibility <span>+</span></summary><p>Loan availability, rates and eligibility depend on the lender. Confirm documents, charges and subsidy conditions before proceeding.</p><div className="solar-inline-brands">{supportedBanks.map(bank=><span key={bank}>{bank}</span>)}</div></details></div></section>


    </main>
  </SolarPageLayout>;
}
