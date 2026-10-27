import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Integro — Sunlight, thoughtfully connected.', description: 'A brighter everyday, engineered from sunlight. Explore solar power for homes and businesses in Kerala with Integro.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="en"><body>{children}</body></html> }
