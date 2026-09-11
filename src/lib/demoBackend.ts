import type { Appointment, AppointmentInput, SignUpInput, UserProfile } from '../types';
import { dateFromToday } from './format';

interface StoredUser extends UserProfile {
  passwordHash: string;
}

const USERS_KEY = 'arden_demo_users';
const SESSION_KEY = 'arden_demo_session';
const APPOINTMENTS_KEY = 'arden_demo_appointments';
const DEMO_PASSWORD_HASH = '365cf41ae5a2beac2ac6ce44f77619e4c2c099d57f36ba8ec1537094f5d64877';

const demoUser: StoredUser = {
  id: 'demo-patient',
  email: 'demo@ardenclinic.com',
  fullName: 'Alex Morgan',
  phone: '(555) 014-2086',
  dateOfBirth: '1992-04-18',
  memberSince: '2024-02-12',
  passwordHash: DEMO_PASSWORD_HASH,
};

function storageAvailable() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (storageAvailable()) window.localStorage.setItem(key, JSON.stringify(value));
}

function users() {
  const saved = readJson<StoredUser[]>(USERS_KEY, []);
  if (!saved.some((user) => user.id === demoUser.id)) {
    const seeded = [demoUser, ...saved];
    writeJson(USERS_KEY, seeded);
    return seeded;
  }
  return saved;
}

function seedAppointments() {
  const saved = readJson<Appointment[]>(APPOINTMENTS_KEY, []);
  if (saved.some((appointment) => appointment.userId === demoUser.id)) return saved;

  const seeded: Appointment[] = [
    {
      id: 'demo-upcoming-1',
      userId: demoUser.id,
      service: 'Annual wellness visit',
      clinician: 'Dr. Maya Chen',
      appointmentDate: dateFromToday(5),
      appointmentTime: '10:30',
      status: 'upcoming',
      notes: 'Routine annual checkup',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-completed-1',
      userId: demoUser.id,
      service: 'Primary care visit',
      clinician: 'Dr. Maya Chen',
      appointmentDate: dateFromToday(-42),
      appointmentTime: '09:00',
      status: 'completed',
      notes: '',
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
  ];
  const next = [...seeded, ...saved];
  writeJson(APPOINTMENTS_KEY, next);
  return next;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function withoutPassword(user: StoredUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    memberSince: user.memberSince,
  };
}

export function getDemoSession(): UserProfile | null {
  const sessionId = storageAvailable() ? window.localStorage.getItem(SESSION_KEY) : null;
  if (!sessionId) return null;
  const user = users().find((item) => item.id === sessionId);
  return user ? withoutPassword(user) : null;
}

export async function demoSignIn(email: string, password: string) {
  const user = users().find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
  const passwordHash = await sha256(password);
  if (!user || user.passwordHash !== passwordHash) {
    throw new Error('The email or password you entered is incorrect.');
  }
  window.localStorage.setItem(SESSION_KEY, user.id);
  seedAppointments();
  return withoutPassword(user);
}

export async function demoSignUp(input: SignUpInput) {
  const allUsers = users();
  if (allUsers.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: input.email.trim().toLowerCase(),
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    dateOfBirth: '',
    memberSince: new Date().toISOString().slice(0, 10),
    passwordHash: await sha256(input.password),
  };
  writeJson(USERS_KEY, [...allUsers, user]);
  window.localStorage.setItem(SESSION_KEY, user.id);
  return withoutPassword(user);
}

export function demoSignOut() {
  if (storageAvailable()) window.localStorage.removeItem(SESSION_KEY);
}

export function getDemoAppointments(userId: string) {
  return seedAppointments()
    .filter((appointment) => appointment.userId === userId)
    .sort((a, b) => `${a.appointmentDate}${a.appointmentTime}`.localeCompare(`${b.appointmentDate}${b.appointmentTime}`));
}

export function addDemoAppointment(userId: string, input: AppointmentInput) {
  const appointment: Appointment = {
    id: crypto.randomUUID(),
    userId,
    ...input,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };
  const current = seedAppointments();
  writeJson(APPOINTMENTS_KEY, [...current, appointment]);
  return appointment;
}

export function cancelDemoAppointment(appointmentId: string) {
  const current = seedAppointments();
  writeJson(
    APPOINTMENTS_KEY,
    current.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status: 'cancelled' as const } : appointment,
    ),
  );
}

export function updateDemoProfile(profile: UserProfile) {
  const allUsers = users();
  writeJson(
    USERS_KEY,
    allUsers.map((user) => (user.id === profile.id ? { ...user, ...profile } : user)),
  );
  return profile;
}
