'use client';
import {useState} from 'react';
import {SolarFinance} from '@/components/solar-finance';
export function CalculatorExperience({compact=false}:{compact?:boolean}){const [bill,setBill]=useState(4000);return <SolarFinance bill={bill} onBillChange={setBill}/>;}
