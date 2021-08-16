export function getIMDBNumber(url: string): string {
  const regex = /([0-9]+)[\/]*\s*$/;
  return url.match(regex) ? `tt${url.match(regex)[1]}` : undefined;
}
