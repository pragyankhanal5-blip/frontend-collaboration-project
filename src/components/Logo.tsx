import { Link } from 'react-router-dom';

interface LogoProps {
  light?: boolean;
  compact?: boolean;
  to?: string;
}

export function Logo({ light = false, compact = false, to = '/' }: LogoProps) {
  return (
    <Link to={to} className={`brand-logo${light ? ' brand-logo--light' : ''}`} aria-label="Arden Clinic home">
      <span className="brand-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 42 42" role="img">
          <path d="M21 6.5c-2.6 5.2-7.1 8.6-13 10.1 4.7 2.3 7.5 7.1 7.5 12.8 2.4-3.3 4.1-7.4 5.5-12 1.4 4.6 3.1 8.7 5.5 12 0-5.7 2.8-10.5 7.5-12.8-5.9-1.5-10.4-4.9-13-10.1Z" />
          <circle cx="21" cy="17.3" r="2.7" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-logo__text">
          <strong>ARDEN</strong>
          <small>CLINIC</small>
        </span>
      )}
    </Link>
  );
}
