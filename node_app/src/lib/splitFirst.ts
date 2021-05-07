/**
 * Split a string of the first occurrence of a delimiter
 *
 * @param str - The string to split
 * @param delim - The delimiter to split on
 * @returns The array containing the split string
 */
export function splitFirst(str: string, delim: string): string[] {
  const i = str.indexOf(delim);
  if (i !== -1) {
    return [str.slice(0, i), str.slice(i + 1)];
  } else {
    return [str];
  }
}
