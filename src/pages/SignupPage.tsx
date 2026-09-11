import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Eye, EyeOff, Loader2, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupPage() {
  const { signUp, user, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const wantsBooking = new URLSearchParams(location.search).get('intent') === 'book';

  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    number: /\d/.test(password),
    mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
  }), [password]);
  const passwordValid = Object.values(passwordChecks).every(Boolean);

  useEffect(() => {
    if (!loading && user) navigate(wantsBooking ? '/portal/appointments?book=true' : '/portal', { replace: true });
  }, [loading, user, navigate, wantsBooking]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (fullName.trim().split(/\s+/).length < 2) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!passwordValid) {
      setError('Choose a password that meets all three requirements.');
      return;
    }
    if (!accepted) {
      setError('Please agree to the terms and privacy notice.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await signUp({ fullName, email, phone, password });
      if (result.needsConfirmation) {
        setConfirmationEmail(email);
      } else {
        navigate(wantsBooking ? '/portal/appointments?book=true' : '/portal', { replace: true });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmationEmail) {
    return (
      <AuthLayout eyebrow="One more step" title={<>Check your <em>inbox.</em></>} subtitle="We sent a secure confirmation link to finish setting up your account.">
        <div className="confirmation-card">
          <span><Mail size={26} /></span>
          <h2>Email sent</h2>
          <p>Open the link sent to <strong>{confirmationEmail}</strong>. You can close this page once your email is confirmed.</p>
          <Link className="button button--primary" to="/login">Return to sign in <ArrowRight size={17} /></Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout wide eyebrow={wantsBooking ? 'Book your first visit' : 'Become a patient'} title={<>Create your <em>account.</em></>} subtitle="It only takes a minute. Your health details can be added later.">
      <form className="auth-form auth-form--signup" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label className="field-group" htmlFor="signup-name">
            <span>Full name</span>
            <div className="input-with-icon"><UserRound size={18} /><input id="signup-name" type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="First and last name" /></div>
          </label>
          <label className="field-group" htmlFor="signup-phone">
            <span>Phone <small>Optional</small></span>
            <div className="input-with-icon"><Phone size={18} /><input id="signup-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(555) 000-0000" /></div>
          </label>
        </div>
        <label className="field-group" htmlFor="signup-email">
          <span>Email address</span>
          <div className="input-with-icon"><Mail size={18} /><input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div>
        </label>
        <label className="field-group" htmlFor="signup-password">
          <span>Create a password</span>
          <div className="input-with-icon"><LockKeyhole size={18} /><input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        </label>
        <div className="password-rules" aria-label="Password requirements">
          <span className={passwordChecks.length ? 'is-valid' : ''}><i><Check size={10} /></i>8+ characters</span>
          <span className={passwordChecks.mixed ? 'is-valid' : ''}><i><Check size={10} /></i>Upper & lowercase</span>
          <span className={passwordChecks.number ? 'is-valid' : ''}><i><Check size={10} /></i>One number</span>
        </div>
        <label className="check-field check-field--terms"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span><Checkmark /></span><p>I agree to Arden Clinic’s <Link to="/terms" target="_blank">Terms of Use</Link> and acknowledge the <Link to="/privacy" target="_blank">Privacy Notice</Link>.</p></label>
        {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}
        <button className="button button--primary auth-submit" type="submit" disabled={submitting}>
          {submitting ? <><Loader2 className="spin" size={18} /> Creating account…</> : <>{wantsBooking ? 'Create account & book' : 'Create patient account'} <ArrowRight size={18} /></>}
        </button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in <ArrowRight size={15} /></Link></p>
      <div className="auth-security-note"><LockKeyhole size={14} /> Your information is encrypted and never sold</div>
    </AuthLayout>
  );
}

function Checkmark() {
  return <svg viewBox="0 0 12 10" aria-hidden="true"><path d="m1 5 3 3.2L11 1" /></svg>;
}
