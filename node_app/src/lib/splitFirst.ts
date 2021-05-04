export function splitFirst(str: string, delim: string): string[] {
  const i = str.indexOf(delim);
  if (i !== -1) {
    return [str.slice(0, i), str.slice(i + 1)];
  } else {
    return [str];
  }
}
