import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, Check, Loader2, LockKeyhole, Mail, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate, initials } from '../lib/format';
import type { UserProfile } from '../types';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState<UserProfile | null>(user);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [reminders, setReminders] = useState(true);
  const [careUpdates, setCareUpdates] = useState(true);

  useEffect(() => setForm(user), [user]);

  function change(field: keyof UserProfile, value: string) {
    setForm((current) => current ? { ...current, [field]: value } : current);
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    setError('');
    if (form.fullName.trim().split(/\s+/).length < 2) {
      setError('Please enter your first and last name.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(form);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 4000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save your details.');
    } finally {
      setSaving(false);
    }
  }

  if (!form) return null;

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-card__header">
          <div className="profile-avatar">{initials(form.fullName)}</div>
          <div><h2>{form.fullName}</h2><p>{form.email}</p><span>Patient since {formatDate(form.memberSince, { month: 'long', year: 'numeric' })}</span></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="profile-form-heading"><div><h3>Personal information</h3><p>Used by your care team to contact and identify you.</p></div><span><ShieldCheck size={15} /> Private</span></div>
          <div className="profile-form-grid">
            <label className="field-group" htmlFor="profile-name"><span>Full name</span><div className="input-with-icon"><UserRound size={18} /><input id="profile-name" value={form.fullName} onChange={(event) => change('fullName', event.target.value)} /></div></label>
            <label className="field-group" htmlFor="profile-dob"><span>Date of birth</span><div className="input-with-icon"><CalendarDays size={18} /><input id="profile-dob" type="date" value={form.dateOfBirth} onChange={(event) => change('dateOfBirth', event.target.value)} /></div></label>
            <label className="field-group" htmlFor="profile-email"><span>Email address</span><div className="input-with-icon is-disabled"><Mail size={18} /><input id="profile-email" type="email" value={form.email} disabled /></div><small>Contact support to change your sign-in email.</small></label>
            <label className="field-group" htmlFor="profile-phone"><span>Phone number</span><div className="input-with-icon"><Phone size={18} /><input id="profile-phone" type="tel" value={form.phone} onChange={(event) => change('phone', event.target.value)} placeholder="(555) 000-0000" /></div></label>
          </div>
          {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}
          <div className="profile-form-actions"><button className="button button--primary" type="submit" disabled={saving}>{saving ? <><Loader2 className="spin" size={17} /> Saving…</> : saved ? <><Check size={17} /> Saved</> : <><Save size={17} /> Save changes</>}</button></div>
        </form>
      </section>

      <section className="profile-card preference-card">
        <div className="profile-form-heading"><div><h3>Communication preferences</h3><p>Choose which updates you’d like to receive.</p></div></div>
        <label><span><strong>Appointment reminders</strong><small>Email and text reminders before a visit</small></span><input type="checkbox" checked={reminders} onChange={(event) => setReminders(event.target.checked)} /><i /></label>
        <label><span><strong>Care updates</strong><small>Helpful follow-ups and seasonal health notes</small></span><input type="checkbox" checked={careUpdates} onChange={(event) => setCareUpdates(event.target.checked)} /><i /></label>
      </section>

      <section className="profile-card security-card">
        <div><span><LockKeyhole size={20} /></span><div><h3>Password & security</h3><p>Your account uses a secure password and encrypted connection.</p></div></div>
        <Link className="button button--ghost" to="/forgot-password">Change password</Link>
      </section>
    </div>
  );
}
