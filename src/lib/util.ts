export function textify(enumValue?: string): string {
  if (!enumValue)
    return enumValue;

    if ([ "ONA", "OVA", "TV" ].includes(enumValue))
      return enumValue;

    if (enumValue === "TV_SHORT")
      return "TV Short";

  return enumValue.split("_")
    .map(v => v.charAt(0) + v.substring(1).toLowerCase())
    .join(" ");
}

export function hexToRgb(hex: string) {
  if (!hex)
    return null;
    
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
}

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

  if (!opts?.includeSeconds && parsed.minutes < 1 && str.length === 0)
    str += "<1m";

  return str.replace(/([a-z])/g, "$1 ");
}

type ReadableOpts = {
  includeWeeks?: boolean;
  includeSeconds?: boolean;
}

type ParsedTime = {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}