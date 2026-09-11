export type BackendMode = 'supabase' | 'demo';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  memberSince: string;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  service: string;
  clinician: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface SignUpInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AppointmentInput {
  service: string;
  clinician: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export interface AuthResult {
  needsConfirmation?: boolean;
}
