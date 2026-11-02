 'use client';
import {useEffect} from 'react';
export default function CalculatorRedirect(){useEffect(()=>{window.location.replace('/solar-systems#calculator')},[]);return <main style={{padding:40}}><p>The solar calculator is now part of Solar Systems.</p><a href="/solar-systems#calculator">Open solar calculator</a></main>;}
