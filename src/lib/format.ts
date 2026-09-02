export function formatINR(amount: number) {
  if (!amount) return "No prize pool";
  return `₹${amount.toLocaleString("en-IN")}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(dateish: string) {
  const d = new Date(dateish);
  if (Number.isNaN(d.getTime())) return null;
  return { day: d.getUTCDate(), month: MONTHS[d.getUTCMonth()], year: d.getUTCFullYear() };
}

export function formatDate(dateish: string) {
  const p = parts(dateish);
  if (!p) return "Date TBD";
  return `${p.day} ${p.month} ${p.year}`;
}

export function formatDateRange(start: string, end: string) {
  const a = parts(start);
  const b = parts(end);
  if (!a) return "Dates TBD";
  if (!b || (a.day === b.day && a.month === b.month)) return `${a.day} ${a.month} ${a.year}`;
  if (a.month === b.month && a.year === b.year) return `${a.day}–${b.day} ${a.month} ${a.year}`;
  return `${a.day} ${a.month} – ${b.day} ${b.month} ${b.year}`;
}

export function formatDateTime(dateish: string) {
  const d = new Date(dateish);
  if (Number.isNaN(d.getTime())) return "Time TBD";
  const time = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  return `${formatDate(dateish)} · ${time}`;
}

export function ageFromDob(dob: string) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

const SPORT_LABELS: Record<string, string> = {
  football: "Football",
  kabaddi: "Kabaddi",
  basketball: "Basketball",
  khokho: "Kho-Kho",
  badminton: "Badminton",
  boxing: "Boxing",
  yoga: "Yoga",
  athletics: "Athletics",
};

export function sportLabel(sportId: string) {
  return SPORT_LABELS[sportId] ?? sportId.charAt(0).toUpperCase() + sportId.slice(1);
}

export const LEVEL_LABELS: Record<string, string> = {
  COLLEGE: "College level",
  NODAL: "Nodal level",
  STATE: "State level",
  NATIONAL: "National level",
};
