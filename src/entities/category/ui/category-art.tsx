import type { CategorySlug } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/cn';

/**
 * Schematic line art, one glyph per category.
 *
 * Product photography would be the obvious answer here. It is also the reason
 * most hardware stores look identical: the same supplier renders on the same
 * white background. These are technical drawings instead — the language of the
 * spec sheet, drawn in the same copper the rest of the site is built from, and
 * they weigh nothing.
 */

const STROKE = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function Glyph({ slug }: { slug: CategorySlug }) {
  const copper = 'var(--tc-copper)';
  const line = 'currentColor';

  switch (slug) {
    case 'gpu':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="18" y="42" width="164" height="76" rx="6" stroke={line} opacity={0.5} />
          <path d="M18 118v14h20v-14" stroke={line} opacity={0.5} />
          <circle cx="70" cy="80" r="24" stroke={copper} strokeWidth={2.5} />
          <circle cx="130" cy="80" r="24" stroke={copper} strokeWidth={2.5} />
          <circle cx="70" cy="80" r="7" stroke={copper} />
          <circle cx="130" cy="80" r="7" stroke={copper} />
          <path d="M70 56v10M70 94v10M52 80h10M78 80h10" stroke={copper} opacity={0.8} />
          <path d="M130 56v10M130 94v10M112 80h10M138 80h10" stroke={copper} opacity={0.8} />
          <path d="M150 42V28h24v14" stroke={line} opacity={0.5} />
          <path d="M26 132h140" stroke={copper} strokeWidth={3} opacity={0.35} />
        </g>
      );
    case 'cpu':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="52" y="32" width="96" height="96" rx="8" stroke={line} opacity={0.5} />
          <rect x="72" y="52" width="56" height="56" rx="4" stroke={copper} strokeWidth={2.5} />
          <path d="M88 68h24M88 80h24M88 92h16" stroke={copper} opacity={0.7} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} stroke={line} opacity={0.45}>
              <path d={`M${68 + i * 16} 32V18`} />
              <path d={`M${68 + i * 16} 128v14`} />
              <path d={`M52 ${48 + i * 16}H38`} />
              <path d={`M148 ${48 + i * 16}h14`} />
            </g>
          ))}
        </g>
      );
    case 'motherboard':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="22" y="20" width="156" height="120" rx="6" stroke={line} opacity={0.5} />
          <rect x="40" y="38" width="42" height="42" rx="4" stroke={copper} strokeWidth={2.5} />
          <path d="M100 38h58M100 50h58M100 62h44" stroke={line} opacity={0.4} />
          <path d="M40 100h118M40 114h118" stroke={copper} strokeWidth={3} opacity={0.55} />
          <circle cx="164" cy="30" r="3" stroke={line} opacity={0.5} />
          <circle cx="36" cy="130" r="3" stroke={line} opacity={0.5} />
          <path d="M92 80h66" stroke={copper} opacity={0.35} />
        </g>
      );
    case 'ram':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="24" y="44" width="152" height="52" rx="4" stroke={line} opacity={0.5} />
          <path
            d="M32 44l8-16h120l8 16"
            stroke={copper}
            strokeWidth={2.5}
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${48 + i * 20} 28v16`} stroke={copper} opacity={0.6} />
          ))}
          <path d="M24 96h152v14H24z" stroke={line} opacity={0.4} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <path key={i} d={`M${36 + i * 16} 110v10`} stroke={copper} opacity={0.5} />
          ))}
          <path d="M92 96v14" stroke={line} opacity={0.6} strokeWidth={3} />
        </g>
      );
    case 'storage':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="20" y="62" width="148" height="36" rx="4" stroke={line} opacity={0.5} />
          <rect x="34" y="72" width="40" height="16" rx="2" stroke={copper} strokeWidth={2.5} />
          <rect x="82" y="72" width="40" height="16" rx="2" stroke={copper} strokeWidth={2.5} />
          <path d="M168 74h14v12h-14" stroke={line} opacity={0.5} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${26 + i * 6} 98v8`} stroke={copper} opacity={0.55} />
          ))}
          <path d="M132 76h24M132 84h24" stroke={line} opacity={0.4} />
        </g>
      );
    case 'psu':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="30" y="36" width="140" height="88" rx="6" stroke={line} opacity={0.5} />
          <circle cx="90" cy="80" r="32" stroke={copper} strokeWidth={2.5} />
          <circle cx="90" cy="80" r="8" stroke={copper} />
          <path
            d="M90 48a32 32 0 0 1 27 16M90 112a32 32 0 0 1-27-16M118 96a32 32 0 0 1-28 16"
            stroke={copper}
            opacity={0.6}
          />
          <path d="M144 56h14M144 70h14M144 84h14M144 98h14" stroke={line} opacity={0.45} />
          <path d="M170 80h16" stroke={copper} strokeWidth={3} opacity={0.5} />
        </g>
      );
    case 'case':
      return (
        <g {...STROKE} strokeWidth={2}>
          <path d="M56 16h88a6 6 0 0 1 6 6v116a6 6 0 0 1-6 6H56a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6z" stroke={line} opacity={0.5} />
          <circle cx="80" cy="48" r="16" stroke={copper} strokeWidth={2.5} />
          <circle cx="80" cy="94" r="16" stroke={copper} strokeWidth={2.5} />
          <path d="M120 36v82" stroke={line} opacity={0.35} />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M132 ${40 + i * 18}h10`} stroke={copper} opacity={0.5} />
          ))}
          <path d="M50 128h100" stroke={line} opacity={0.4} />
        </g>
      );
    case 'cooling':
      return (
        <g {...STROKE} strokeWidth={2}>
          <circle cx="100" cy="80" r="52" stroke={line} opacity={0.45} />
          <circle cx="100" cy="80" r="12" stroke={copper} strokeWidth={2.5} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = (i * Math.PI * 2) / 7;
            const x1 = 100 + Math.cos(a) * 14;
            const y1 = 80 + Math.sin(a) * 14;
            const x2 = 100 + Math.cos(a + 0.75) * 48;
            const y2 = 80 + Math.sin(a + 0.75) * 48;
            return (
              <path
                key={i}
                d={`M${x1.toFixed(1)} ${y1.toFixed(1)}Q${(100 + Math.cos(a + 0.3) * 34).toFixed(1)} ${(80 + Math.sin(a + 0.3) * 34).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`}
                stroke={copper}
                strokeWidth={2.5}
                opacity={0.75}
              />
            );
          })}
          <rect x="40" y="20" width="120" height="120" rx="8" stroke={line} opacity={0.3} />
        </g>
      );
    case 'monitor':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="18" y="24" width="164" height="94" rx="6" stroke={line} opacity={0.5} />
          <rect x="32" y="38" width="136" height="66" rx="3" stroke={copper} strokeWidth={2.5} opacity={0.8} />
          <path d="M84 118v14h32v-14" stroke={line} opacity={0.5} />
          <path d="M64 132h72" stroke={copper} strokeWidth={3} opacity={0.55} />
          <path d="M48 90l26-30 20 22 18-26 30 34" stroke={copper} opacity={0.6} />
        </g>
      );
    case 'peripherals':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="16" y="52" width="118" height="66" rx="6" stroke={line} opacity={0.5} />
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                <rect
                  key={col}
                  x={26 + col * 13}
                  y={62 + row * 13}
                  width={9}
                  height={9}
                  rx={1.5}
                  stroke={copper}
                  opacity={row === 2 && col > 1 && col < 6 ? 0.9 : 0.4}
                />
              ))}
            </g>
          ))}
          <path
            d="M156 46c12 0 20 9 20 21v26c0 12-8 21-20 21s-20-9-20-21V67c0-12 8-21 20-21z"
            stroke={line}
            opacity={0.5}
          />
          <path d="M156 46v22" stroke={copper} strokeWidth={2.5} />
        </g>
      );
    case 'laptop':
      return (
        <g {...STROKE} strokeWidth={2}>
          <path d="M42 26h116v72H42z" stroke={line} opacity={0.5} />
          <rect x="54" y="38" width="92" height="48" rx="2" stroke={copper} strokeWidth={2.5} opacity={0.8} />
          <path d="M22 98h156l-10 26H32z" stroke={line} opacity={0.5} />
          <path d="M78 110h44" stroke={copper} strokeWidth={3} opacity={0.6} />
          <path d="M66 56h30M66 66h50M66 76h20" stroke={copper} opacity={0.45} />
        </g>
      );
    case 'prebuilt':
      return (
        <g {...STROKE} strokeWidth={2}>
          <rect x="18" y="30" width="72" height="104" rx="6" stroke={line} opacity={0.5} />
          <circle cx="42" cy="56" r="12" stroke={copper} strokeWidth={2.5} />
          <circle cx="42" cy="90" r="12" stroke={copper} strokeWidth={2.5} />
          <path d="M66 46v72" stroke={line} opacity={0.3} />
          <rect x="104" y="34" width="80" height="56" rx="4" stroke={line} opacity={0.5} />
          <rect x="114" y="44" width="60" height="36" rx="2" stroke={copper} strokeWidth={2.5} opacity={0.8} />
          <path d="M136 90v12h16V90" stroke={line} opacity={0.5} />
          <path d="M122 102h44" stroke={copper} strokeWidth={3} opacity={0.5} />
          <path d="M104 122h80" stroke={line} opacity={0.35} />
        </g>
      );
  }
}

export interface CategoryArtProps {
  slug: CategorySlug;
  className?: string;
  /** Adds the drifting copper field behind the glyph. Off inside dense grids. */
  ambient?: boolean;
}

export function CategoryArt({ slug, className, ambient = true }: CategoryArtProps) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      {ambient && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 45%, var(--tc-glow), transparent 70%)',
          }}
        />
      )}
      <svg
        viewBox="0 0 200 160"
        className="size-full text-muted-foreground"
        role="presentation"
        aria-hidden="true"
      >
        <Glyph slug={slug} />
      </svg>
    </div>
  );
}
