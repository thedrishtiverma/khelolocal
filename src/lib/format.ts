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
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!match) return null;
  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  const validated = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay));
  if (
    validated.getUTCFullYear() !== birthYear ||
    validated.getUTCMonth() + 1 !== birthMonth ||
    validated.getUTCDate() !== birthDay
  ) {
    return null;
  }

  const currentDate = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map(({ type, value }) => [type, value]),
  );
  const currentYear = Number(currentDate.year);
  const currentMonth = Number(currentDate.month);
  const currentDay = Number(currentDate.day);
  const hasHadBirthday =
    currentMonth > birthMonth || (currentMonth === birthMonth && currentDay >= birthDay);
  return currentYear - birthYear - (hasHadBirthday ? 0 : 1);
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
