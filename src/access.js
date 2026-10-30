// Lightweight client-side gate. This is not a security boundary.
const businessDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function beijingDatePassword(now = new Date()) {
  const parts = businessDateFormatter.formatToParts(now);
  const value = (type) => parts.find(part => part.type === type).value;
  return `${value('year')}${value('month')}${value('day')}`;
}

export function verifyAccessPassword(password, now = new Date()) {
  return password === beijingDatePassword(now);
}
