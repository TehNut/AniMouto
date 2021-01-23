export function parseSeconds(seconds: number, includeWeeks?: boolean): ParsedTime {
  let weeks = 0;
  if (includeWeeks) {
    weeks = Math.floor(seconds / (3600 * 24 * 7));
    seconds -= weeks * 3600 * 24 * 7;
  }
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return {
    weeks,
    days,
    hours,
    minutes,
    seconds
  } as ParsedTime;
}

export function readableTime(parsed: ParsedTime, opts?: ReadableOpts): string {
  let str = "";

  if (parsed.weeks && opts?.includeWeeks)
    str += parsed.weeks + "w";
  if (parsed.days)
    str += parsed.days + "d";
  if (parsed.hours)
    str += parsed.hours + "h";
  if (parsed.minutes)
    str += parsed.minutes + "m";
  if (parsed.seconds && opts?.includeSeconds)
    str += parsed.seconds + "s";

  if (!opts?.includeSeconds && parsed.minutes < 1)
    str += "<1m";

  return str.replace(/([a-z])/g, "$1 ");
}

interface ReadableOpts {
  includeWeeks?: boolean;
  includeSeconds?: boolean;
}

interface ParsedTime {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}