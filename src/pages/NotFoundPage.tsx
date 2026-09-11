import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <Logo />
      <span>404</span>
      <h1>This page couldn’t be found.</h1>
      <p>The link may have moved, or the address might be incomplete.</p>
      <Link className="button button--primary" to="/"><ArrowLeft size={17} /> Return to Arden Clinic</Link>
    </main>
  );
}
