import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Loader2, Stethoscope, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dateFromToday, formatDate, formatTime } from '../lib/format';
import type { Appointment } from '../types';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onBooked?: (appointment: Appointment) => void;
}

const services = [
  { name: 'Annual wellness visit', duration: '45 min' },
  { name: 'Primary care visit', duration: '30 min' },
  { name: 'Women’s health', duration: '45 min' },
  { name: 'Pediatric care', duration: '30 min' },
  { name: 'Same-day sick visit', duration: '20 min' },
  { name: 'Lab & diagnostics', duration: '20 min' },
];

const clinicians = [
  'First available clinician',
  'Dr. Maya Chen',
  'Dr. James Wilson',
  'Dr. Elena Ruiz',
];

const timeSlots = ['08:30', '09:00', '10:30', '11:15', '13:30', '14:15', '15:00', '16:30'];

export function BookingModal({ open, onClose, onBooked }: BookingModalProps) {
  const { bookAppointment } = useAuth();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(services[0].name);
  const [clinician, setClinician] = useState(clinicians[0]);
  const [appointmentDate, setAppointmentDate] = useState(dateFromToday(1));
  const [appointmentTime, setAppointmentTime] = useState('10:30');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => closeButton.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, submitting]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const appointment = await bookAppointment({
        service,
        clinician: clinician === clinicians[0] ? 'Care team · clinician assigned soon' : clinician,
        appointmentDate,
        appointmentTime,
        notes,
      });
      onBooked?.(appointment);
      setStep(1);
      setNotes('');
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not book that time. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !submitting) onClose();
    }}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <header className="booking-modal__header">
          <div>
            <span className="eyebrow eyebrow--small">Online scheduling</span>
            <h2 id="booking-title">Book your visit</h2>
          </div>
          <button ref={closeButton} className="icon-button" type="button" onClick={onClose} aria-label="Close booking dialog">
            <X size={21} />
          </button>
        </header>

        <div className="booking-progress" aria-label={`Step ${step} of 2`}>
          <span className="is-active"><i>{step > 1 ? <Check size={13} /> : '1'}</i> Visit</span>
          <b className={step > 1 ? 'is-filled' : ''} />
          <span className={step > 1 ? 'is-active' : ''}><i>2</i> Date & time</span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="booking-modal__body">
              <div className="form-section-title">
                <Stethoscope size={18} />
                <div><h3>What can we help with?</h3><p>Choose the visit type that best fits your needs.</p></div>
              </div>
              <div className="service-options">
                {services.map((item) => (
                  <label key={item.name} className={service === item.name ? 'is-selected' : ''}>
                    <input type="radio" name="service" value={item.name} checked={service === item.name} onChange={() => setService(item.name)} />
                    <span><strong>{item.name}</strong><small>{item.duration}</small></span>
                    <i><Check size={13} /></i>
                  </label>
                ))}
              </div>
              <label className="field-label" htmlFor="booking-clinician">Preferred clinician</label>
              <div className="select-wrap">
                <select id="booking-clinician" value={clinician} onChange={(event) => setClinician(event.target.value)}>
                  {clinicians.map((name) => <option key={name}>{name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="booking-modal__body">
              <div className="form-section-title">
                <CalendarDays size={18} />
                <div><h3>Choose a convenient time</h3><p>Appointments shown in your local time.</p></div>
              </div>
              <label className="field-label" htmlFor="booking-date">Date</label>
              <input
                className="text-input"
                id="booking-date"
                type="date"
                min={dateFromToday(1)}
                max={dateFromToday(90)}
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.target.value)}
                required
              />
              <label className="field-label">Available times</label>
              <div className="time-options">
                {timeSlots.map((time) => (
                  <label key={time} className={appointmentTime === time ? 'is-selected' : ''}>
                    <input type="radio" name="time" value={time} checked={appointmentTime === time} onChange={() => setAppointmentTime(time)} />
                    <Clock3 size={14} /> {formatTime(time)}
                  </label>
                ))}
              </div>
              <label className="field-label" htmlFor="booking-notes">Anything your care team should know? <span>Optional</span></label>
              <textarea
                className="text-input"
                id="booking-notes"
                rows={3}
                maxLength={300}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Briefly tell us the reason for your visit"
              />
              <div className="booking-summary">
                <CalendarDays size={18} />
                <div><span>{service}</span><strong>{formatDate(appointmentDate, { weekday: 'long', month: 'long', day: 'numeric' })} at {formatTime(appointmentTime)}</strong></div>
              </div>
              {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}
            </div>
          )}

          <footer className="booking-modal__footer">
            {step === 2 ? (
              <button className="button button--ghost" type="button" onClick={() => setStep(1)} disabled={submitting}>
                <ArrowLeft size={17} /> Back
              </button>
            ) : <span />}
            {step === 1 ? (
              <button className="button button--primary" type="button" onClick={() => setStep(2)}>
                Continue <ArrowRight size={17} />
              </button>
            ) : (
              <button className="button button--primary" type="submit" disabled={submitting}>
                {submitting ? <><Loader2 className="spin" size={17} /> Confirming…</> : <>Confirm appointment <Check size={17} /></>}
              </button>
            )}
          </footer>
        </form>
      </section>
    </div>
  );
}
