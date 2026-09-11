import { useEffect, useState } from 'react';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime, initials } from '../lib/format';
import type { Appointment } from '../types';
import { BookingModal } from './BookingModal';
import { Logo } from './Logo';

export interface PortalOutletContext {
  openBooking: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/portal': { title: 'Overview', subtitle: 'Your health, all in one place.' },
  '/portal/appointments': { title: 'Appointments', subtitle: 'Manage upcoming and past visits.' },
  '/portal/profile': { title: 'Personal details', subtitle: 'Keep your contact information up to date.' },
};

export function PortalLayout() {
  const { user, signOut, backendMode } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [toast, setToast] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const heading = pageTitles[location.pathname] ?? pageTitles['/portal'];

  useEffect(() => {
    setSidebarOpen(false);
    setAccountOpen(false);
    if (location.pathname === '/portal/appointments' && new URLSearchParams(location.search).get('book') === 'true') {
      setBookingOpen(true);
      navigate('/portal/appointments', { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  function handleBooked(appointment: Appointment) {
    setToast(`Appointment confirmed for ${formatDate(appointment.appointmentDate, { month: 'short', day: 'numeric' })} at ${formatTime(appointment.appointmentTime)}.`);
  }

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar${sidebarOpen ? ' portal-sidebar--open' : ''}`}>
        <div className="portal-sidebar__top">
          <Logo light to="/" />
          <button className="icon-button portal-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={21} /></button>
        </div>
        <nav className="portal-nav" aria-label="Patient portal">
          <p>My care</p>
          <NavLink to="/portal" end><LayoutDashboard size={19} /><span>Overview</span></NavLink>
          <NavLink to="/portal/appointments"><CalendarDays size={19} /><span>Appointments</span></NavLink>
          <p>Account</p>
          <NavLink to="/portal/profile"><UserRound size={19} /><span>Personal details</span></NavLink>
          <a href="mailto:care@ardenclinic.com"><CircleHelp size={19} /><span>Help & support</span></a>
        </nav>
        <div className="portal-sidebar__help">
          <ShieldCheck size={20} />
          <div><strong>Your data is protected</strong><span>Private and securely stored</span></div>
        </div>
        {backendMode === 'demo' && <div className="demo-mode-pill"><i /> Demo mode</div>}
      </aside>

      {sidebarOpen && <button className="portal-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <main className="portal-main">
        <header className="portal-topbar">
          <button className="portal-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="portal-topbar__heading">
            <h1>{heading.title}</h1>
            <p>{heading.subtitle}</p>
          </div>
          <div className="portal-topbar__actions">
            <button className="topbar-icon" aria-label="Notifications"><Bell size={19} /><i /></button>
            <button className="button button--primary topbar-book" onClick={() => setBookingOpen(true)}><Plus size={17} /> Book a visit</button>
            <div className="account-menu">
              <button className="account-menu__trigger" onClick={() => setAccountOpen((value) => !value)} aria-expanded={accountOpen}>
                <span>{initials(user?.fullName ?? 'Patient')}</span>
                <div><strong>{user?.fullName}</strong><small>Patient</small></div>
                <ChevronDown size={16} />
              </button>
              {accountOpen && (
                <div className="account-menu__popover">
                  <div><strong>{user?.fullName}</strong><span>{user?.email}</span></div>
                  <NavLink to="/portal/profile"><Settings size={16} /> Account settings</NavLink>
                  <button onClick={handleSignOut}><LogOut size={16} /> Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="portal-content">
          <Outlet context={{ openBooking: () => setBookingOpen(true) } satisfies PortalOutletContext} />
        </div>
      </main>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} onBooked={handleBooked} />
      {toast && (
        <div className="toast" role="status">
          <span><ClipboardList size={18} /></span>
          <div><strong>You're all set</strong><p>{toast}</p></div>
          <button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={17} /></button>
        </div>
      )}
    </div>
  );
}
