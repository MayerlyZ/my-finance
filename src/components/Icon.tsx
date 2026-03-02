/**
 * iOS-style SF Symbols-inspired SVG icon component.
 * Each icon uses strokes only (weight: 1.8–2) to match SF Symbol aesthetics.
 */

interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

type IconName =
  | 'home' | 'plus-circle' | 'minus-circle' | 'pin' | 'ellipsis'
  | 'arrow-up-circle' | 'arrow-down-circle'
  | 'banknote' | 'creditcard'
  | 'chart-bar' | 'chart-pie'
  | 'briefcase' | 'laptop' | 'trending-up' | 'gift'
  | 'hamburger' | 'car' | 'pill' | 'film' | 'tshirt' | 'zap' | 'book' | 'house' | 'package'
  | 'handshake' | 'clock' | 'calendar'
  | 'trash' | 'checkmark-circle' | 'xmark-circle'
  | 'chevron-left' | 'chevron-right'
  | 'person-circle'
  | 'lock' | 'sparkles' | 'info'
  | 'arrow-swap';

const PATHS: Record<IconName, React.ReactNode> = {
  // ── Nav ──────────────────────────────────
  home: (
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'plus-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </>
  ),
  'minus-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" strokeLinecap="round" />
    </>
  ),
  pin: (
    <>
      <path d="M12 2a5 5 0 015 5c0 4-5 10-5 10S7 11 7 7a5 5 0 015-5z" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  ellipsis: (
    <path d="M5 12h.01M12 12h.01M19 12h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} />
  ),

  // ── Transactions ─────────────────────────
  'arrow-up-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16V8M8.5 11.5L12 8l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'arrow-down-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8.5 12.5L12 16l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // ── Payment ──────────────────────────────
  banknote: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" strokeLinecap="round" strokeWidth={2.5} />
    </>
  ),
  creditcard: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <path d="M6 15h4" strokeLinecap="round" strokeWidth={2} />
    </>
  ),

  // ── Charts ───────────────────────────────
  'chart-bar': (
    <path d="M4 20V14h4v6H4zM10 20V8h4v12h-4zM16 20V4h4v16h-4z" strokeLinejoin="round" strokeLinecap="round" />
  ),
  'chart-pie': (
    <>
      <path d="M12 2v10l8.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12A9.5 9.5 0 1021.5 7L12 12z" strokeLinejoin="round" />
    </>
  ),

  // ── Income categories ────────────────────
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinejoin="round" />
      <path d="M2 13h20" strokeLinecap="round" />
    </>
  ),
  laptop: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M1 19h22" strokeLinecap="round" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M3 17l5-5 4 4 9-10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M3 8h18v4H3z" />
      <path d="M12 8v13M12 8C12 8 9 5 9 3.5a3 3 0 016 0C15 5 12 8 12 8z" strokeLinejoin="round" />
    </>
  ),

  // ── Expense categories ───────────────────
  hamburger: (
    <>
      <path d="M4 10.5h16" strokeLinecap="round" />
      <path d="M4 14.5h16" strokeLinecap="round" />
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 18h16" strokeLinecap="round" />
    </>
  ),
  car: (
    <>
      <path d="M5 11l1.5-4.5h11L19 11" strokeLinejoin="round" />
      <rect x="2" y="11" width="20" height="6" rx="2" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M5 17H2v-3M19 17h3v-3" strokeLinecap="round" />
    </>
  ),
  pill: (
    <>
      <path d="M10.81 3.19a5.5 5.5 0 017.77 7.77L8.26 21.29a5.5 5.5 0 01-7.77-7.77z" strokeLinejoin="round" />
      <path d="M8.56 8.56l6.88 6.88" strokeLinecap="round" />
    </>
  ),
  film: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5" strokeLinecap="round" />
    </>
  ),
  tshirt: (
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10a1 1 0 001 1h10a1 1 0 001-1V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" strokeLinejoin="round" />
  ),
  zap: (
    <path d="M13 2L4.09 12.96A.5.5 0 004.5 14H11l-1 8 8.91-10.96A.5.5 0 0018.5 10H12l1-8z" strokeLinejoin="round" />
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinejoin="round" />
    </>
  ),
  house: (
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
  ),
  package: (
    <>
      <path d="M12 2l10 5.5v9L12 22 2 16.5v-9L12 2z" strokeLinejoin="round" />
      <path d="M12 22V12M2 7.5l10 5 10-5" strokeLinecap="round" />
      <path d="M7 4.5L17 10" strokeLinecap="round" />
    </>
  ),

  // ── Loans ────────────────────────────────
  handshake: (
    <>
      <path d="M9.04 2H2v7l5.29 5.29a2 2 0 002.83 0l3.59-3.59a2 2 0 000-2.83L9.04 2z" strokeLinejoin="round" />
      <path d="M4 6h.01M22 2h-7.04l-4.67 4.67a2 2 0 000 2.83l3.59 3.59a2 2 0 002.83 0L22 7.96V2z" strokeLinejoin="round" />
      <path d="M9.04 14.71l-5.75 5.75" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </>
  ),

  // ── Actions ──────────────────────────────
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </>
  ),
  'checkmark-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'xmark-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </>
  ),
  'chevron-left': (
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-right': (
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  ),

  // ── Misc ─────────────────────────────────
  'person-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9" r="3" />
      <path d="M6.17 18.57A7 7 0 0117.83 18.57" strokeLinecap="round" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-5M12 8h.01" strokeLinecap="round" strokeWidth={2.5} />
    </>
  ),
  'arrow-swap': (
    <>
      <path d="M7 16V4M7 4L4 7M7 4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8v12M17 20l3-3M17 20l-3-3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export default function Icon({ name, size = 24, color = 'currentColor', style, className }: IconProps & { name: IconName }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
