/**
 * Inline SVG icons. Deliberately dependency-free — an icon library would be
 * ~40KB of JS for a marketing site that needs a dozen glyphs.
 */
type IconProps = { className?: string };

const base = "h-6 w-6";

export function Droplet({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.7s6.2 6.3 6.2 10.5a6.2 6.2 0 1 1-12.4 0C5.8 9 12 2.7 12 2.7Z" />
      <path d="M9.2 14.4a2.8 2.8 0 0 0 2.8 2.8" />
    </svg>
  );
}

export function Wind({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h8a2.5 2.5 0 1 1-2.5 2.5" />
    </svg>
  );
}

export function CloudRain({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M17.5 15.5a4 4 0 0 0-1.2-7.8 5.5 5.5 0 0 0-10.5 1.6 3.6 3.6 0 0 0 .7 7.1" />
      <path d="M8 18.5 7 21M12 18.5 11 21M16 18.5 15 21" />
    </svg>
  );
}

export function Shield({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.8 4.5 5.9v5.5c0 4.4 3.1 8.5 7.5 9.8 4.4-1.3 7.5-5.4 7.5-9.8V5.9L12 2.8Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  );
}

export function Home({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3.5 10.4 12 3.6l8.5 6.8" />
      <path d="M5.6 12v8.4h12.8V12" />
      <path d="M10 20.4v-5h4v5" />
    </svg>
  );
}

export function Layers({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m12 3 8.5 4.6L12 12.2 3.5 7.6 12 3Z" />
      <path d="m3.5 12 8.5 4.6 8.5-4.6" />
      <path d="m3.5 16.4 8.5 4.6 8.5-4.6" />
    </svg>
  );
}

export function Clock({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export function Phone({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 3h3.1c.6 0 1.1.4 1.2 1l.7 3.3c.1.5-.1 1-.5 1.3l-1.8 1.3a13.4 13.4 0 0 0 5.8 5.8l1.3-1.8c.3-.4.8-.6 1.3-.5l3.3.7c.6.1 1 .6 1 1.2v3.1c0 .8-.7 1.5-1.5 1.4C10.8 20.8 3.2 13.2 5.2 4.5 5.3 3.7 5.9 3 6.6 3Z" />
    </svg>
  );
}

export function MapPin({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10.4c0 5.6-8 12-8 12s-8-6.4-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.2" r="2.8" />
    </svg>
  );
}

export function Check({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function ArrowRight({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function Alert({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10.3 3.9 2.5 17.4A1.9 1.9 0 0 0 4.2 20.3h15.6a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" />
      <path d="M12 9.2v4.2M12 17h.01" />
    </svg>
  );
}

export function Star({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
    </svg>
  );
}

export function Menu({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Maps a Service.icon string to its component. */
export const serviceIcons: Record<string, (p: IconProps) => React.JSX.Element> = {
  droplet: Droplet,
  wind: Wind,
  "cloud-rain": CloudRain,
  shield: Shield,
  home: Home,
  layers: Layers,
  clock: Clock,
};
