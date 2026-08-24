interface Segment {
  from: number;
  to: number;
  color: string;
}

interface GaugeProps {
  score: number;
  min: number;
  max: number;
  segments: Segment[];
  size?: number;
}

const CX = 100;
const CY = 100;
const R = 82;
const STROKE = 22;

function scoreToAngle(score: number, min: number, max: number): number {
  const t = Math.min(1, Math.max(0, (score - min) / (max - min)));
  return 180 - t * 180;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function Gauge({ score, min, max, segments, size = 200 }: GaugeProps) {
  const needleAngle = scoreToAngle(score, min, max);
  const needleTip = polarToCartesian(CX, CY, R - STROKE / 2 - 4, needleAngle);

  return (
    <svg viewBox="0 0 200 115" width={size} height={size * 0.575} xmlns="http://www.w3.org/2000/svg">
      {segments.map((seg, i) => {
        const startAngle = scoreToAngle(seg.from, min, max);
        const endAngle = scoreToAngle(seg.to, min, max);
        return (
          <path
            key={i}
            d={describeArc(CX, CY, R, startAngle, endAngle)}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE}
          />
        );
      })}
      <line
        x1={CX}
        y1={CY}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="#f4f0e8"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={7} fill="#f4f0e8" />
    </svg>
  );
}
