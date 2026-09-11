import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Info, Loader2, LockKeyhole, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn, user, loading, backendMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) navigate('/portal', { replace: true });
  }, [loading, user, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter both your email address and password.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from?.startsWith('/portal') ? from : '/portal', { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function useDemo() {
    setEmail('demo@ardenclinic.com');
    setPassword('Arden123!');
    setError('');
  }

  return (
    <AuthLayout eyebrow="Patient portal" title={<>Welcome <em>back.</em></>} subtitle="Sign in to manage appointments and your care details.">
      {new URLSearchParams(location.search).get('reset') === 'sent' && (
        <div className="form-alert form-alert--success" role="status">Check your inbox for a secure password reset link.</div>
      )}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field-group" htmlFor="login-email">
          <span>Email address</span>
          <div className="input-with-icon">
            <Mail size={18} />
            <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </div>
        </label>
        <label className="field-group" htmlFor="login-password">
          <span>Password</span>
          <div className="input-with-icon">
            <LockKeyhole size={18} />
            <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </label>
        <div className="form-options">
          <label className="check-field"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span><Checkmark /></span>Remember me</label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}
        <button className="button button--primary auth-submit" type="submit" disabled={submitting}>
          {submitting ? <><Loader2 className="spin" size={18} /> Signing in…</> : <>Sign in securely <ArrowRight size={18} /></>}
        </button>
      </form>

      {backendMode === 'demo' && (
        <div className="demo-access">
          <Info size={18} />
          <div><strong>Preview the patient portal</strong><p>Use the ready-made demo account—no signup needed.</p></div>
          <button type="button" onClick={useDemo}>Fill demo login</button>
        </div>
      )}

      <p className="auth-switch">New to Arden? <Link to="/signup">Create your account <ArrowRight size={15} /></Link></p>
      <div className="auth-security-note"><LockKeyhole size={14} /> Secure, encrypted patient access</div>
    </AuthLayout>
  );
}

function Checkmark() {
  return <svg viewBox="0 0 12 10" aria-hidden="true"><path d="m1 5 3 3.2L11 1" /></svg>;
}
