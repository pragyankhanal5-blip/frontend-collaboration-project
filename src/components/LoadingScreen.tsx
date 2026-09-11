import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading">
      <Logo />
      <span className="loading-screen__bar"><i /></span>
    </div>
  );
}
