import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  addDemoAppointment,
  cancelDemoAppointment,
  demoSignIn,
  demoSignOut,
  demoSignUp,
  getDemoAppointments,
  getDemoSession,
  updateDemoProfile,
} from '../lib/demoBackend';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type {
  Appointment,
  AppointmentInput,
  AuthResult,
  BackendMode,
  SignUpInput,
  UserProfile,
} from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  appointments: Appointment[];
  loading: boolean;
  backendMode: BackendMode;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  bookAppointment: (input: AppointmentInput) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  refreshAppointments: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfile(user: SupabaseUser, row?: Record<string, unknown> | null): UserProfile {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: String(row?.full_name ?? metadata.full_name ?? metadata.name ?? 'Patient'),
    phone: String(row?.phone ?? metadata.phone ?? ''),
    dateOfBirth: String(row?.date_of_birth ?? ''),
    memberSince: String(row?.created_at ?? user.created_at).slice(0, 10),
  };
}

function mapAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    service: String(row.service),
    clinician: String(row.clinician),
    appointmentDate: String(row.appointment_date),
    appointmentTime: String(row.appointment_time).slice(0, 5),
    status: row.status as Appointment['status'],
    notes: String(row.notes ?? ''),
    createdAt: String(row.created_at),
  };
}

async function fetchSupabaseProfile(user: SupabaseUser) {
  if (!supabase) return mapProfile(user);
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  return mapProfile(user, data);
}

async function fetchSupabaseAppointments(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => mapAppointment(row));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const backendMode: BackendMode = isSupabaseConfigured ? 'supabase' : 'demo';

  const syncSupabaseUser = useCallback(async (authUser: SupabaseUser | null) => {
    if (!authUser) {
      setUser(null);
      setAppointments([]);
      return;
    }
    const [profile, upcoming] = await Promise.all([
      fetchSupabaseProfile(authUser),
      fetchSupabaseAppointments(authUser.id),
    ]);
    setUser(profile);
    setAppointments(upcoming);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialise() {
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (active) await syncSupabaseUser(data.session?.user ?? null);
        } else {
          const session = getDemoSession();
          if (active) {
            setUser(session);
            setAppointments(session ? getDemoAppointments(session.id) : []);
          }
        }
      } catch (error) {
        console.error('Unable to restore session', error);
        if (active) {
          setUser(null);
          setAppointments([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void initialise();

    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      window.setTimeout(() => {
        if (active) void syncSupabaseUser(session?.user ?? null);
      }, 0);
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, [syncSupabaseUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error(error.message);
      await syncSupabaseUser(data.user);
      return;
    }
    const profile = await demoSignIn(email, password);
    setUser(profile);
    setAppointments(getDemoAppointments(profile.id));
  }, [syncSupabaseUser]);

  const signUp = useCallback(async (input: SignUpInput): Promise<AuthResult> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: {
            full_name: input.fullName.trim(),
            phone: input.phone.trim(),
          },
        },
      });
      if (error) throw new Error(error.message);
      if (data.session && data.user) await syncSupabaseUser(data.user);
      return { needsConfirmation: !data.session };
    }
    const profile = await demoSignUp(input);
    setUser(profile);
    setAppointments([]);
    return {};
  }, [syncSupabaseUser]);

  const signOut = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } else {
      demoSignOut();
    }
    setUser(null);
    setAppointments([]);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (supabase) {
      const redirectTo = `${window.location.origin}${window.location.pathname}#/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) throw new Error(error.message);
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 500));
  }, []);

  const updateProfile = useCallback(async (profile: UserProfile) => {
    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          date_of_birth: profile.dateOfBirth || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
      if (error) throw new Error(error.message);
      await supabase.auth.updateUser({
        data: { full_name: profile.fullName, phone: profile.phone },
      });
    } else {
      updateDemoProfile(profile);
    }
    setUser(profile);
  }, []);

  const bookAppointment = useCallback(async (input: AppointmentInput) => {
    if (!user) throw new Error('Please sign in before booking an appointment.');
    let appointment: Appointment;
    if (supabase) {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service: input.service,
          clinician: input.clinician,
          appointment_date: input.appointmentDate,
          appointment_time: input.appointmentTime,
          notes: input.notes,
        })
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      appointment = mapAppointment(data);
    } else {
      appointment = addDemoAppointment(user.id, input);
    }
    setAppointments((current) =>
      [...current, appointment].sort((a, b) =>
        `${a.appointmentDate}${a.appointmentTime}`.localeCompare(`${b.appointmentDate}${b.appointmentTime}`),
      ),
    );
    return appointment;
  }, [user]);

  const cancelAppointment = useCallback(async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw new Error(error.message);
    } else {
      cancelDemoAppointment(id);
    }
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment,
      ),
    );
  }, []);

  const refreshAppointments = useCallback(async () => {
    if (!user) return;
    setAppointments(
      supabase ? await fetchSupabaseAppointments(user.id) : getDemoAppointments(user.id),
    );
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    appointments,
    loading,
    backendMode,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updateProfile,
    bookAppointment,
    cancelAppointment,
    refreshAppointments,
  }), [
    user,
    appointments,
    loading,
    backendMode,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updateProfile,
    bookAppointment,
    cancelAppointment,
    refreshAppointments,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This hook intentionally lives next to its provider to keep the context API cohesive.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
