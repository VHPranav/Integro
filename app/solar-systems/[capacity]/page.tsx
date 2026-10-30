import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sun } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SolarPageLayout } from '@/components/solar-page-layout';
import { BlueprintReveal } from '@/components/blueprint-reveal';
import { solarSystems } from '@/lib/solar-systems';

export function generateStaticParams() {
  return solarSystems.map(({ slug }) => ({ capacity: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ capacity: string }> }): Promise<Metadata> {
  const { capacity } = await params;
  const system = solarSystems.find((item) => item.slug === capacity);
  return system ? { title: `${system.capacity} kW solar system | Integro`, description: `${system.billRange}: explore a ${system.capacity} kW solar system starting point with Integro in Kerala.` } : {};
}

export default async function SolarCapacityPage({ params }: { params: Promise<{ capacity: string }> }) {
  const { capacity } = await params;
  const index = solarSystems.findIndex((item) => item.slug === capacity);
  const system = solarSystems[index];
  if (!system) notFound();
  const previous = solarSystems[index - 1];
  const next = solarSystems[index + 1];
  return <SolarPageLayout>
    <main id="top" className="solar-detail-page">
      <div className="solar-breadcrumb"><Link href="/solar-systems"><ArrowLeft size={14} /> All systems</Link><span>/</span><span>{system.capacity} kW</span></div>
      <section className={`solar-detail-hero solar-detail-${system.slug}`}>
        <div className="solar-detail-copy"><span className="solar-guide-kicker"><Sun size={14} /> BILL GUIDE / {system.billRange.toUpperCase()}</span><h1>A {system.capacity} kW starting point <em>for your home.</em></h1><p>{system.detail}</p><Link className="button dark" href="/solar-systems/enquire">Discuss this system <ArrowUpRight size={17} /></Link></div>
        <div className="solar-detail-art"><BlueprintReveal src="/artwork/solar-home-watercolor-cutout.webp" alt="Watercolor Kerala home with solar panels" /><div className="solar-detail-badge"><span>STARTING SIZE</span><strong>{system.capacity}<small> kW</small></strong></div></div>
      </section>
      <section className="solar-detail-facts"><div><span className="solar-guide-kicker">MONTHLY BILL GUIDE</span><strong>{system.billRange.replace(' / month', '')}</strong><small>A starting range, not a guaranteed system match</small></div><div><span className="solar-guide-kicker">ROOF AREA ALLOWANCE</span><strong>{system.roof}</strong><small>Allow for access paths, setbacks and shade</small></div><div><span className="solar-guide-kicker">GENERATION GUIDE</span><strong>{system.generation}</strong><small>Approximate monthly planning estimate</small></div><div><span className="solar-guide-kicker">INDICATIVE PRICE</span><strong>{system.price}</strong><small>{system.priceNote}</small></div></section>
      <section className="solar-detail-explain"><div><span className="solar-guide-kicker">WHAT WE’LL LOOK AT</span><h2>Designed around<br /><em>the way you use power.</em></h2></div><div className="solar-detail-checks"><p><Check size={17} />Recent electricity bills and daytime usage</p><p><Check size={17} />Roof direction, shade, structure and access</p><p><Check size={17} />Panel and inverter compatibility</p><p><Check size={17} />Future battery or backup requirements</p><p><Check size={17} />Any applicable subsidy or financing eligibility</p></div><p className="solar-disclaimer">Capacity, production, roof area and price are indicative. Final design and commercial terms are shared after the site and bill review. Savings depend on usage, tariff, season and system performance.</p></section>
      <nav className="solar-detail-pagination" aria-label="Other system sizes">{previous ? <Link href={`/solar-systems/${previous.slug}`}><ArrowLeft size={15} /><span><small>PREVIOUS SIZE</small>{previous.capacity} kW system</span></Link> : <Link href="/solar-systems"><ArrowLeft size={15} /><span><small>ALL SYSTEMS</small>Back to the guide</span></Link>}{next ? <Link href={`/solar-systems/${next.slug}`}><span><small>NEXT SIZE</small>{next.capacity} kW system</span><ArrowRight size={15} /></Link> : <Link href="/solar-systems/enquire"><span><small>ABOVE 10 kW</small>Plan a larger system</span><ArrowRight size={15} /></Link>}</nav>
    </main>
  </SolarPageLayout>;
}
