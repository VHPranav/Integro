import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Sun } from 'lucide-react';
import { SolarPageLayout } from '@/components/solar-page-layout';
import { BlueprintReveal } from '@/components/blueprint-reveal';
import { equipmentBrands, solarSystems, supportedBanks } from '@/lib/solar-systems';

export const metadata: Metadata = {
  title: 'Solar systems for Kerala homes | Integro',
  description: 'Explore an initial rooftop solar capacity based on your monthly electricity bill, then refine it with Integro around your roof and energy use.',
};

export default function SolarSystemsPage() {
  return <SolarPageLayout>
    <main id="top" className="solar-guide-page">
      <section className="solar-guide-hero">
        <div className="solar-guide-copy">
          <span className="solar-guide-kicker"><Sun size={15} /> A clear place to start</span>
          <h1>Find the right<br />system for your <span>home.</span></h1>
          <p>Use your average monthly electricity bill as a first clue. We’ll help shape the capacity around your roof, daily energy use and the way you want your home to run.</p>
          <a className="button dark" href="#capacity-guide">Explore system sizes <ArrowRight size={17} /></a>
        </div>
        <div className="solar-guide-art"><BlueprintReveal src="/artwork/solar-home-watercolor-cutout.webp" alt="Watercolor Kerala home with rooftop solar panels" /></div>
        <div className="solar-guide-hero-caption micro"><span>INTEGRO / SOLAR FOR EVERYDAY</span><span>KERALA, INDIA</span></div>
      </section>

      <section id="capacity-guide" className="capacity-guide">
        <div className="solar-page-heading"><span className="solar-guide-kicker">01 / START WITH YOUR BILL</span><h2>A system that fits<br /><em>the way you live.</em></h2><p>Choose the range closest to your monthly bill. These capacities are starting recommendations; a site visit and bill review confirm the right system.</p></div>
        <div className="capacity-card-grid">{solarSystems.map((system, index) => <Link href={`/solar-systems/${system.slug}`} key={system.slug} className={`capacity-card capacity-card-${index + 1}`}>
          <div className="capacity-card-top"><span className="capacity-icon"><Sun size={19} /></span><span className="micro">0{index + 1} / CAPACITY GUIDE</span></div>
          <strong className="capacity-number">{system.capacity}<small> kW</small></strong>
          <span className="capacity-range">{system.billRange}</span>
          <p>{system.description}</p>
          <span className="capacity-price">{system.price}</span>
          <span className="capacity-card-link">View this system <ArrowUpRight size={17} /></span>
        </Link>)}</div>
        <div className="capacity-custom"><div><span className="solar-guide-kicker">ABOVE ₹26,000 / MONTH</span><h3>Need more than 10 kW?</h3><p>We’ll look at the property, your usage and future plans, then help you explore a larger system.</p></div><Link className="button dark" href="/solar-systems/enquire">Enquire with us <ArrowUpRight size={17} /></Link></div>
        <p className="solar-disclaimer">Monthly generation and roof area are indicative planning allowances. Actual output and layout depend on location, season, shading, roof access and equipment. Final capacity and price follow a site review and written proposal.</p>
      </section>

      <section className="solar-support-section">
        <div className="solar-page-heading"><span className="solar-guide-kicker">02 / MORE THAN PANELS</span><h2>Thought through,<br /><em>from roof to switch.</em></h2></div>
        <div className="solar-support-grid"><article className="solar-benefit-list"><h3>Why plan with Integro?</h3>{['Capacity selected around your bill and roof','Quality panels and inverters, subject to availability','Professional installation and aftercare','Guidance on checking subsidy eligibility','Loan and EMI options can be discussed'].map((benefit) => <p key={benefit}><Check size={17} />{benefit}</p>)}</article>
          <article className="solar-finance-card"><span className="solar-guide-kicker">FINANCING, IF IT FITS</span><h3>Ask about loan and EMI options.</h3><p>Financing availability and terms depend on the lender, the system and your eligibility. Integro can help you understand the application path; confirm all rates, documents and subsidy details with the bank and relevant programme before proceeding.</p><div className="bank-list" aria-label="Banks listed in the supplied reference">{supportedBanks.map((bank) => <span key={bank}>{bank}</span>)}</div></article></div>
      </section>

      <section className="solar-brand-section"><div><span className="solar-guide-kicker">EQUIPMENT WE CAN DISCUSS</span><h2>Good components.<br /><em>Chosen for the system.</em></h2><p>Brands listed in your reference guide. Final equipment options depend on stock, compatibility and the system design.</p></div><div className="equipment-brand-list">{equipmentBrands.map((brand) => <span key={brand}>{brand}</span>)}</div></section>
      <section className="solar-guide-cta"><div><span className="solar-guide-kicker">A GOOD SYSTEM STARTS WITH A CONVERSATION</span><h2>Let’s see what<br /><em>your roof can do.</em></h2></div><Link className="button light" href="/solar-systems/enquire">Talk to Integro <ArrowUpRight size={17} /></Link></section>
    </main>
  </SolarPageLayout>;
}
