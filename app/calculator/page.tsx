import type {Metadata} from 'next';
import {SolarPageLayout} from '@/components/solar-page-layout';
import {CalculatorExperience} from '@/components/calculator-experience';
export const metadata:Metadata={title:'Solar & EMI calculator | Integro',description:'Explore solar capacity, estimated investment, residential subsidy and monthly EMI based on your electricity bill.'};
export default function Page(){return <SolarPageLayout><main id="top"><CalculatorExperience/></main></SolarPageLayout>;}
