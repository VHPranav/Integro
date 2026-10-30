import Image from 'next/image';

export function Brand() {
  return <span className="brand"><Image src="/brand/integro-logo-horizontal.png" alt="Integro Energy Solution" width={540} height={142} priority /></span>;
}
