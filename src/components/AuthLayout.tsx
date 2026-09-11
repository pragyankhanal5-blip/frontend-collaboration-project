import { ArrowLeft, CalendarCheck, Check, HeartPulse, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface AuthLayoutProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  wide?: boolean;
}

export function AuthLayout({ eyebrow, title, subtitle, children, wide = false }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-panel__head"><Logo light /><Link to="/"><ArrowLeft size={16} /> Back to clinic</Link></div>
        <div className="auth-brand-panel__content">
          <span className="eyebrow eyebrow--light">Care that knows you</span>
          <h2>Health feels simpler<br />when care is <em>connected.</em></h2>
          <div className="auth-care-preview">
            <div className="auth-care-preview__top">
              <span><HeartPulse size={19} /></span>
              <div><small>Your care plan</small><strong>Everything looks on track</strong></div>
              <i><Check size={14} /></i>
            </div>
            <div className="auth-care-preview__line"><span><CalendarCheck size={17} /></span><div><small>Next visit</small><strong>Annual wellness · Sep 18</strong></div></div>
            <div className="auth-care-preview__foot"><ShieldCheck size={16} /> Private, secure access to your care</div>
          </div>
          <blockquote>“Everything I need is in one place, and getting help never feels complicated.”</blockquote>
          <div className="auth-quote-person"><span>NP</span><div><strong>Nina P.</strong><small>Patient since 2023</small></div></div>
        </div>
        <p className="auth-brand-panel__foot">© {new Date().getFullYear()} Arden Clinic <span>·</span> Privacy <span>·</span> Help</p>
      </section>

      <section className="auth-form-panel">
        <Link className="auth-mobile-back" to="/"><ArrowLeft size={16} /> Back to clinic</Link>
        <div className={`auth-form-wrap${wide ? ' auth-form-wrap--wide' : ''}`}>
          <div className="auth-form-heading">
            <span className="eyebrow eyebrow--small">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
        </div>
        <p className="auth-mobile-foot">Your information is encrypted and securely stored.</p>
      </section>
    </main>
  );
}
