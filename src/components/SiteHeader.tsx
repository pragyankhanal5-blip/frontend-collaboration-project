import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

const navItems = [
  { label: 'Services', id: 'services' },
  { label: 'Our team', id: 'team' },
  { label: 'Why Arden', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  function jumpTo(id: string) {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="shell site-header__inner">
        <Logo />
        <nav className={`site-nav${open ? ' site-nav--open' : ''}`} aria-label="Primary navigation">
          <div className="site-nav__mobile-head">
            <Logo />
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close navigation">
              <X size={22} />
            </button>
          </div>
          <div className="site-nav__links">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => jumpTo(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="site-nav__mobile-actions">
            <Link className="button button--ghost" to={user ? '/portal' : '/login'}>
              {user ? 'Patient portal' : 'Log in'}
            </Link>
            <Link className="button button--primary" to={user ? '/portal/appointments?book=true' : '/signup?intent=book'}>
              Book a visit <ArrowUpRight size={17} />
            </Link>
          </div>
        </nav>
        <div className="site-header__actions">
          <Link className="header-login" to={user ? '/portal' : '/login'}>
            {user ? 'Patient portal' : 'Log in'}
          </Link>
          <Link className="button button--primary button--header" to={user ? '/portal/appointments?book=true' : '/signup?intent=book'}>
            Book a visit <ArrowUpRight size={16} />
          </Link>
          <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open}>
            <Menu size={23} />
          </button>
        </div>
      </div>
      {open && <button className="nav-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    </header>
  );
}
