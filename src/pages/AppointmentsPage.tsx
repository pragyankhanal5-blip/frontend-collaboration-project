import { useMemo, useState } from 'react';
import { CalendarDays, Check, Clock3, MapPin, MoreHorizontal, Plus, Stethoscope, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { PortalOutletContext } from '../components/PortalLayout';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime } from '../lib/format';
import type { Appointment, AppointmentStatus } from '../types';

type Filter = 'upcoming' | 'past' | 'all';

export function AppointmentsPage() {
  const { appointments, cancelAppointment } = useAuth();
  const { openBooking } = useOutletContext<PortalOutletContext>();
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const visible = useMemo(() => appointments.filter((appointment) => {
    if (filter === 'upcoming') return appointment.status === 'upcoming';
    if (filter === 'past') return appointment.status === 'completed' || appointment.status === 'cancelled';
    return true;
  }), [appointments, filter]);

  async function confirmCancellation() {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await cancelAppointment(cancelId);
      setCancelId(null);
      setMenuId(null);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="appointments-page">
      <div className="appointments-toolbar">
        <div className="segment-control" role="tablist" aria-label="Appointment filters">
          {(['upcoming', 'past', 'all'] as Filter[]).map((item) => <button role="tab" aria-selected={filter === item} className={filter === item ? 'is-active' : ''} key={item} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}{item === 'upcoming' && <span>{appointments.filter((entry) => entry.status === 'upcoming').length}</span>}</button>)}
        </div>
        <button className="button button--primary appointments-book" onClick={openBooking}><Plus size={17} /> New appointment</button>
      </div>

      {visible.length ? (
        <div className="appointment-list">
          {visible.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} menuOpen={menuId === appointment.id} onMenu={() => setMenuId(menuId === appointment.id ? null : appointment.id)} onCancel={() => { setCancelId(appointment.id); setMenuId(null); }} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span><CalendarDays size={28} /></span>
          <h2>{filter === 'upcoming' ? 'No upcoming appointments' : 'Nothing to show yet'}</h2>
          <p>{filter === 'upcoming' ? 'Find a date and time that works for your next visit.' : 'Your appointment history will appear here.'}</p>
          {filter === 'upcoming' && <button className="button button--primary" onClick={openBooking}>Book an appointment <Plus size={17} /></button>}
        </div>
      )}

      <div className="appointments-note"><span><Clock3 size={18} /></span><div><strong>Need to make a change?</strong><p>Appointments can be changed or cancelled online up to 24 hours before your visit. For same-day help, call <a href="tel:+15550142800">(555) 014-2800</a>.</p></div></div>

      {cancelId && (
        <div className="modal-layer modal-layer--small" onMouseDown={(event) => { if (event.target === event.currentTarget && !cancelling) setCancelId(null); }}>
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
            <button className="icon-button" onClick={() => setCancelId(null)} aria-label="Close"><X size={19} /></button>
            <span className="confirm-modal__icon"><CalendarDays size={24} /></span>
            <h2 id="cancel-title">Cancel this appointment?</h2>
            <p>This will release the time to another patient. You can book a new visit whenever you’re ready.</p>
            <div><button className="button button--ghost" onClick={() => setCancelId(null)} disabled={cancelling}>Keep appointment</button><button className="button button--danger" onClick={confirmCancellation} disabled={cancelling}>{cancelling ? 'Cancelling…' : 'Yes, cancel visit'}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment, menuOpen, onMenu, onCancel }: { appointment: Appointment; menuOpen: boolean; onMenu: () => void; onCancel: () => void }) {
  const statusMeta: Record<AppointmentStatus, { label: string; icon: typeof Check }> = {
    upcoming: { label: 'Confirmed', icon: Check },
    completed: { label: 'Completed', icon: Check },
    cancelled: { label: 'Cancelled', icon: X },
  };
  const StatusIcon = statusMeta[appointment.status].icon;
  const date = new Date(`${appointment.appointmentDate}T12:00:00`);

  return (
    <article className={`appointment-row appointment-row--${appointment.status}`}>
      <div className="appointment-row__date"><span>{formatDate(appointment.appointmentDate, { month: 'short' }).toUpperCase()}</span><strong>{date.getDate()}</strong><small>{formatDate(appointment.appointmentDate, { weekday: 'short' })}</small></div>
      <div className="appointment-row__main"><div><span className={`status-pill status-pill--${appointment.status}`}><StatusIcon size={11} /> {statusMeta[appointment.status].label}</span><h3>{appointment.service}</h3></div><div className="appointment-row__details"><p><Stethoscope size={15} /> {appointment.clinician}</p><p><Clock3 size={15} /> {formatTime(appointment.appointmentTime)}</p><p><MapPin size={15} /> Arden Clinic</p></div>{appointment.notes && <small className="appointment-row__note">Note: {appointment.notes}</small>}</div>
      {appointment.status === 'upcoming' && <div className="appointment-row__menu"><button onClick={onMenu} aria-label="Appointment options"><MoreHorizontal size={20} /></button>{menuOpen && <div><button onClick={onCancel}>Cancel appointment</button></div>}</div>}
    </article>
  );
}
