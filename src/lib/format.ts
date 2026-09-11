export function formatDate(dateValue: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', options ?? {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function shortDate(dateValue: string) {
  return formatDate(dateValue, { month: 'short', day: 'numeric' });
}

export function formatTime(timeValue: string) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'there';
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function dateFromToday(days: number) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}
