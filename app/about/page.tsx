import {ContactCta} from '@/components/contact-cta';
import {AboutCompanyArt} from '@/components/about-company-art';
import {AboutHero} from '@/components/about-hero';
import {ProcessCards} from '@/components/process-cards';
import type {Metadata} from 'next';
import {ArrowUpRight} from 'lucide-react';
import {MotionText} from '@/components/motion-text';
import {SolarPageLayout} from '@/components/solar-page-layout';
export const metadata:Metadata={title:'About Integro Energy Solutions | Integro'};
export default function Page(){return <SolarPageLayout><main id="top" className="inner-page about-page"><AboutHero/> <section id="our-company" className="company-section section-pad"><div className="company-about-copy"><span className="solar-guide-kicker">ABOUT INTEGRO ENERGY SOLUTIONS</span><MotionText as="h2">Built on trust.<br/><span className="serif">Driven by possibility.</span></MotionText><p>At INTEGRO ENERGY SOLUTIONS, we are committed to delivering innovative, reliable, and sustainable energy and infrastructure solutions. We specialize in Solar Power Systems, Lift Solutions, Gate Automation, EV Charging Stations, and Battery Backup Solutions.</p><p>Our mission is to provide high-quality products, professional installation, and dependable customer support while making modern technology accessible and affordable for everyone.</p><p>With a focus on quality, trust, and customer satisfaction, we strive to build long-term relationships and create a smarter, more sustainable future.</p><a className="text-link" href="/services">Explore our services <ArrowUpRight size={17}/></a></div><div className="about-company-image"><AboutCompanyArt/></div></section>
<section className="section-pad"><div className="section-heading"><h2>From first conversation.<br/><span className="serif">To first light.</span></h2></div><ProcessCards/></section><ContactCta/></main></SolarPageLayout>;}