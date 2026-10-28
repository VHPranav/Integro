'use client';

type Props = { night: boolean; active: number; lit: boolean; sunlight: number; outage: boolean };

/** Reuses the hero's exact architectural artwork so both sections share one house. */
export function EnergyIllustration({ night, active, lit, sunlight, outage }: Props) {
  return (
    <div className={`energy-house-illustration ${night ? 'is-night' : ''}`} role="group" aria-label="Solar energy journey shown on the same illustrated Kerala home as the hero">
      <img className="energy-art-day" src="/artwork/solar-home.webp?v=8d10c72160" width="1536" height="1024" alt="The same illustrated Kerala home with rooftop solar panels as shown in the hero" />
      <img className="energy-art-night" src="/artwork/solar-home-night.png" width="1536" height="1024" alt="" aria-hidden="true" />
      <svg viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <path id="energy-solar-route" d="M820 360 L895 360 Q905 360 905 372 L905 390 L1080 390 Q1095 390 1095 405 L1095 530 Q1095 548 1113 548 L1207 548 L1228 554" />
          <path id="energy-storage-route" d="M1244 585 Q1244 612 1275 612 L1310 612 L1310 664" />
          <path id="energy-home-route" d="M1244 585 L1210 616 Q1197 628 1177 628 L1092 628 Q1074 628 1074 647 L1074 682" />
        </defs>

        <g className="energy-circuit" data-active={active} data-outage={outage}>
          <path className={`energy-wire ${active >= 0 ? 'is-revealed' : ''}`} d="M820 360 L895 360 Q905 360 905 372 L905 390 L1080 390 Q1095 390 1095 405 L1095 530 Q1095 548 1113 548 L1207 548 L1228 554" />
          <path className={`energy-wire energy-storage-wire ${active >= 2 ? 'is-revealed' : ''}`} d="M1244 585 Q1244 612 1275 612 L1310 612 L1310 664" />
          <path className={`energy-wire energy-home-wire ${active >= 1 ? 'is-revealed' : ''}`} d="M1244 585 L1210 616 Q1197 628 1177 628 L1092 628 Q1074 628 1074 647 L1074 682" />
          <path className="energy-wire-core" d="M820 360 L895 360 Q905 360 905 372 L905 390 L1080 390 Q1095 390 1095 405 L1095 530 Q1095 548 1113 548 L1207 548 L1228 554" />
          <path className="energy-wire-core energy-storage-core" d="M1244 585 Q1244 612 1275 612 L1310 612 L1310 664" />
          <path className="energy-wire-core energy-home-core" d="M1244 585 L1210 616 Q1197 628 1177 628 L1092 628 Q1074 628 1074 647 L1074 682" />
          {lit && <>
            <circle r="6" className="energy-current"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#energy-solar-route" /></animateMotion></circle>
            <circle r="5" className="energy-current current-storage"><animateMotion dur="3.5s" repeatCount="indefinite"><mpath href="#energy-storage-route" /></animateMotion></circle>
            <circle r="5" className="energy-current current-home"><animateMotion dur="4.4s" repeatCount="indefinite"><mpath href="#energy-home-route" /></animateMotion></circle>
          </>}
          <g className="energy-battery" transform="translate(1276 664)">
            <rect className="battery-case" x="0" y="0" width="68" height="92" rx="2" />
            <path className="battery-mark" d="M38 17 26 39h10l-5 18 14-24H35z" />
            <path className="battery-vent" d="M12 68h44M12 77h44M12 86h44" />
            <circle className="battery-status" cx="56" cy="12" r="3" />
            <text x="34" y="108" textAnchor="middle">STORAGE</text>
          </g>
        </g>

        <path id="energy-sky-axis" d="M110 165 Q768 85 1425 165" fill="none" />
        <g className={`energy-sun ${night ? 'is-away' : ''}`}>
          <circle r="24" /><path d="M0-38v-10m0 96v-10m38-38h10m-96 0h10m65-27 8-8m-68 68 8-8m52 0 8 8m-68-68 8 8" />
          <animateMotion dur="26s" repeatCount="indefinite" rotate="auto"><mpath href="#energy-sky-axis" /></animateMotion>
        </g>
        <g className={`energy-moon ${night ? 'is-visible' : ''}`}>
          <circle r="22" /><path d="M7-18a20 20 0 1 0 16 31A21 21 0 0 1 7-18z" />
          <animateMotion dur="26s" repeatCount="indefinite" rotate="auto"><mpath href="#energy-sky-axis" /></animateMotion>
        </g>
      </svg>
      <span className="energy-sunlight-indicator" aria-hidden="true" style={{ '--sunlight': `${sunlight}%` } as React.CSSProperties} />
    </div>
  );
}
