import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  HeartHandshake,
  MapPin,
  MessageSquareText,
  Phone,
  Plus,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import type { PortalOutletContext } from '../components/PortalLayout';
import { useAuth } from '../context/AuthContext';
import { firstName, formatDate, formatTime } from '../lib/format';

export function DashboardPage() {
  const { user, appointments } = useAuth();
  const { openBooking } = useOutletContext<PortalOutletContext>();
  const upcoming = appointments.find((appointment) => appointment.status === 'upcoming');
  const completedCount = appointments.filter((appointment) => appointment.status === 'completed').length;
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page">
      <section className="portal-welcome">
        <div><span>{formatDate(now.toISOString().slice(0, 10), { weekday: 'long', month: 'long', day: 'numeric' })}</span><h2>{greeting}, {firstName(user?.fullName ?? '')}.</h2><p>Here’s what’s coming up with your care.</p></div>
        <button className="button button--primary portal-mobile-book" onClick={openBooking}><Plus size={17} /> Book a visit</button>
      </section>

      <div className="dashboard-primary-grid">
        {upcoming ? (
          <article className="next-appointment-card">
            <div className="next-appointment-card__head"><span><CalendarDays size={17} /> Your next appointment</span><Link to="/portal/appointments">View details <ChevronRight size={16} /></Link></div>
            <div className="next-appointment-card__body">
              <div className="large-date"><span>{formatDate(upcoming.appointmentDate, { month: 'short' }).toUpperCase()}</span><strong>{new Date(`${upcoming.appointmentDate}T12:00:00`).getDate()}</strong><small>{formatDate(upcoming.appointmentDate, { weekday: 'short' })}</small></div>
              <div className="appointment-main-copy"><span className="status-pill status-pill--confirmed"><i /> Confirmed</span><h3>{upcoming.service}</h3><p><Stethoscope size={16} /> {upcoming.clinician}</p><p><Clock3 size={16} /> {formatTime(upcoming.appointmentTime)} · 45 minutes</p><p><MapPin size={16} /> Arden Clinic · Brookfield</p></div>
            </div>
            <div className="next-appointment-card__foot"><p>Please arrive 10 minutes early and bring a photo ID and insurance card.</p><a href="https://maps.google.com" target="_blank" rel="noreferrer">Get directions <ArrowRight size={15} /></a></div>
          </article>
        ) : (
          <article className="no-appointment-card">
            <span><CalendarDays size={25} /></span><h3>No upcoming visits</h3><p>When you’re ready, choose a time that works for you.</p><button className="button button--cream" onClick={openBooking}>Book an appointment <ArrowRight size={16} /></button>
          </article>
        )}

        <article className="care-team-card">
          <div className="card-section-head"><div><span className="eyebrow eyebrow--small">Your care team</span><h3>Here when you need us</h3></div><span className="care-team-card__online"><i /> Online</span></div>
          <div className="care-team-clinician"><span>MC</span><div><strong>Dr. Maya Chen</strong><small>Primary care physician</small></div><button aria-label="Message Dr. Maya Chen"><MessageSquareText size={18} /></button></div>
          <div className="care-team-actions"><a href="mailto:care@ardenclinic.com"><MessageSquareText size={17} /><span><strong>Send a message</strong><small>Reply within 1 business day</small></span><ChevronRight size={16} /></a><a href="tel:+15550142800"><Phone size={17} /><span><strong>Call the clinic</strong><small>(555) 014-2800</small></span><ChevronRight size={16} /></a></div>
          <p><ShieldCheck size={15} /> For emergencies, call 911 or go to the nearest ER.</p>
        </article>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section__head"><div><h3>Quick actions</h3><p>Common things you can do from your portal.</p></div></div>
        <div className="quick-action-grid">
          <button onClick={openBooking}><span><CalendarDays size={20} /></span><div><strong>Book a visit</strong><small>Find an available time</small></div><ChevronRight size={17} /></button>
          <Link to="/portal/appointments"><span><FileText size={20} /></span><div><strong>Visit history</strong><small>Review past appointments</small></div><ChevronRight size={17} /></Link>
          <a href="mailto:care@ardenclinic.com"><span><MessageSquareText size={20} /></span><div><strong>Message care team</strong><small>Non-urgent questions</small></div><ChevronRight size={17} /></a>
          <Link to="/portal/profile"><span><UserRound size={20} /></span><div><strong>Personal details</strong><small>Update contact information</small></div><ChevronRight size={17} /></Link>
        </div>
      </section>

      <div className="dashboard-secondary-grid">
        <section className="care-summary-card">
          <div className="dashboard-section__head"><div><h3>Care at a glance</h3><p>Your Arden activity summary.</p></div></div>
          <div className="summary-stats">
            <div><span><CheckCircle2 size={19} /></span><strong>{completedCount}</strong><small>Completed visits</small></div>
            <div><span><HeartHandshake size={19} /></span><strong>Dr. Chen</strong><small>Primary clinician</small></div>
            <div><span><ShieldCheck size={19} /></span><strong>Active</strong><small>Patient status</small></div>
          </div>
          <Link to="/portal/appointments">View appointment history <ArrowRight size={16} /></Link>
        </section>

        <section className="wellness-card">
          <div className="wellness-card__icon"><HeartHandshake size={22} /></div>
          <div><span>Seasonal reminder</span><h3>Flu season starts soon</h3><p>Protect yourself and your community. Flu shots are available at short nurse visits.</p><button onClick={openBooking}>Schedule a flu shot <ArrowRight size={16} /></button></div>
        </section>
      </div>
    </div>
  );
}
