import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Enter the email address linked to your account.');
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send the reset email.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout eyebrow="Account recovery" title={sent ? <>Check your <em>inbox.</em></> : <>Reset your <em>password.</em></>} subtitle={sent ? 'If an account exists for that email, a secure reset link is on its way.' : 'Enter your email and we’ll send you a secure link to choose a new password.'}>
      {sent ? (
        <div className="confirmation-card">
          <span className="confirmation-card__success"><Check size={25} /></span>
          <h2>Reset link sent</h2>
          <p>We sent instructions to <strong>{email}</strong>. The link will expire for your security.</p>
          <Link className="button button--primary" to="/login">Back to sign in <ArrowRight size={17} /></Link>
          <button className="text-button" onClick={() => setSent(false)}>Try another email</button>
        </div>
      ) : (
        <>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="field-group" htmlFor="reset-email"><span>Email address</span><div className="input-with-icon"><Mail size={18} /><input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoFocus /></div></label>
            {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}
            <button className="button button--primary auth-submit" type="submit" disabled={submitting}>{submitting ? <><Loader2 className="spin" size={18} /> Sending…</> : <>Send reset link <ArrowRight size={18} /></>}</button>
          </form>
          <p className="auth-switch"><Link to="/login"><ArrowLeft size={15} /> Back to sign in</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
