export const solarSystems = [
  {
    slug: '3kw',
    capacity: 3,
    billRange: 'Up to ₹6,000 / month',
    minBill: 0,
    maxBill: 6000,
    price: '₹2,15,000',
    priceNote: 'Indicative amount from the supplied guide',
    generation: 'About 360 kWh / month',
    roof: 'About 27–30 m²',
    description: 'A considered starting point for homes with lower monthly electricity use.',
    detail: 'The 3 kW system is a starting recommendation for a home with a monthly bill up to ₹6,000. The final capacity depends on your bill history, daytime use, roof orientation, shade and available area.',
  },
  {
    slug: '5kw',
    capacity: 5,
    billRange: '₹6,001–₹13,999 / month',
    minBill: 6001,
    maxBill: 13999,
    price: '₹3,15,000',
    priceNote: 'Indicative amount from the supplied guide',
    generation: 'About 600 kWh / month',
    roof: 'About 45–50 m²',
    description: 'More capacity for households with a higher everyday energy demand.',
    detail: 'For monthly bills from ₹6,001 to ₹13,000, a 5 kW system is a useful first conversation. A roof and bill review helps confirm panel placement and the capacity that best fits your home.',
  },
  {
    slug: '8kw',
    capacity: 8,
    billRange: '₹14,000–₹19,999 / month',
    minBill: 14000,
    maxBill: 19999,
    price: 'Designed to your site',
    priceNote: 'Ask for a proposal after a roof and bill review',
    generation: 'About 960 kWh / month',
    roof: 'About 72–80 m²',
    description: 'A larger rooftop system for homes with sustained higher consumption.',
    detail: 'For monthly bills from ₹13,001 to ₹19,000, start by exploring an 8 kW system. Site conditions, roof access and the way energy is used during the day shape the final design.',
  },
  {
    slug: '10kw',
    capacity: 10,
    billRange: '₹20,000–₹26,000 / month',
    minBill: 20000,
    maxBill: 26000,
    price: 'Designed to your site',
    priceNote: 'Ask for a proposal after a roof and bill review',
    generation: 'About 1,200 kWh / month',
    roof: 'About 90–100 m²',
    description: 'A high-capacity starting point for homes with substantial monthly usage.',
    detail: 'For monthly bills from ₹19,001 to ₹26,000, a 10 kW system gives us a useful place to begin. We confirm the layout, capacity and proposal after reviewing your site and electricity bills.',
  },
] as const;

export const supportedBanks = ['SBI', 'Canara Bank', 'Indian Bank', 'Union Bank of India', 'Punjab National Bank'];
export const equipmentBrands = ['Emmvee', 'Adani Solar', 'Waaree', 'Luminous', 'Microtek', 'Saatvik'];

export function recommendCapacity(bill: number) {
  if (bill <= 6000) return 3;
  if (bill < 14000) return 5;
  if (bill < 20000) return 8;
  if (bill <= 26000) return 10;
  return null;
}
