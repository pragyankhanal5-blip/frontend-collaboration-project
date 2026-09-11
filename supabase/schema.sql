-- Arden Clinic database schema for Supabase
-- Run this file once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  date_of_birth date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service text not null check (char_length(service) between 2 and 120),
  clinician text not null check (char_length(clinician) between 2 and 120),
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  notes text not null default '' check (char_length(notes) <= 500),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists appointments_user_date_idx
  on public.appointments (user_id, appointment_date, appointment_time);

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;

-- A signed-in patient can only see and update their own profile.
create policy "Patients can view their profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Patients can update their profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- A signed-in patient can only access their own appointments.
create policy "Patients can view their appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Patients can create appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "Patients can update their appointments"
  on public.appointments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create the corresponding patient profile after an Auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute procedure public.set_updated_at();

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.appointments to authenticated;
