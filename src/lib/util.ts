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