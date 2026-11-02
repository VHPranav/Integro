import {ArrowUpRight} from 'lucide-react';
import {MotionText} from '@/components/motion-text';
import {CtaArtwork} from '@/components/cta-artwork';
export function ContactCta(){return <section id="contact" className="contact section-pad"><div className="contact-intro"><MotionText as="h2">SEE WHAT SOLAR<br/>CAN DO FOR YOUR HOME</MotionText><MotionText as="p" kind="copy">A thoughtful solar plan starts with the way you live.</MotionText><a className="button dark" href="https://wa.me/919746905948?text=Hello%20Integro%2C%20I%20would%20like%20to%20discuss%20solar%20for%20my%20property." target="_blank" rel="noopener noreferrer">Let’s talk solar <ArrowUpRight size={19}/></a></div><CtaArtwork/></section>;}
