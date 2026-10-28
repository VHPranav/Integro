import type { Metadata } from 'next';
import 'lenis/dist/lenis.css';
import './globals.css';
import {SmoothScroll} from '@/components/smooth-scroll';
export const metadata: Metadata = { title: 'Integro — Sunlight, thoughtfully connected.', description: 'A brighter everyday, engineered from sunlight. Explore solar power for homes and businesses in Kerala with Integro.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="en"><body><SmoothScroll/>{children}</body></html> }
