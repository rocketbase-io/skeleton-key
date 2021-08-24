const lookup = {
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
};

type Unit = keyof typeof lookup;

export function parseTime(time: string): number {
  let ms = 0;
  for (const [, count, unit] of time.matchAll(/([0-9]+)([dhms])/g)) ms += parseFloat(count) * lookup[unit as Unit];
  return ms;
}
