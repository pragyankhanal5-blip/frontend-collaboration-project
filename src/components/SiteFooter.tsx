import { ArrowUpRight, Instagram, Linkedin, MapPin, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

export function SiteFooter() {
  const location = useLocation();
  const navigate = useNavigate();

  function jumpTo(id: string) {
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <footer className="site-footer" id="contact">
      <div className="shell site-footer__grid">
        <div className="site-footer__brand">
          <Logo light />
          <p>Considered care for every chapter of life.</p>
          <div className="site-footer__socials">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>
        <div>
          <h3>Explore</h3>
          <button onClick={() => jumpTo('services')}>Services</button>
          <button onClick={() => jumpTo('team')}>Our clinicians</button>
          <button onClick={() => jumpTo('about')}>About Arden</button>
          <Link to="/login">Patient portal</Link>
        </div>
        <div>
          <h3>Visit us</h3>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="footer-detail">
            <MapPin size={17} />
            <span>214 Hawthorne Avenue<br />Brookfield, CA 90210</span>
          </a>
          <a href="tel:+15550142800" className="footer-detail">
            <Phone size={17} />
            <span>(555) 014-2800</span>
          </a>
        </div>
        <div className="site-footer__hours">
          <h3>Clinic hours</h3>
          <p><span>Mon – Fri</span><strong>8:00 am – 6:00 pm</strong></p>
          <p><span>Saturday</span><strong>9:00 am – 2:00 pm</strong></p>
          <p><span>Sunday</span><strong>Closed</strong></p>
          <Link to="/signup?intent=book">Request a visit <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="shell site-footer__bottom">
        <p>© {new Date().getFullYear()} Arden Clinic. All rights reserved.</p>
        <div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/accessibility">Accessibility</Link></div>
      </div>
    </footer>
  );
}
