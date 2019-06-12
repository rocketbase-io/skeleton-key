

export function isInDomain(url: string, domains: string[]): boolean {
  if (!domains || !domains.length) return false;
  if (domains.indexOf("*") != -1) return true;
  const one = domains.find(domain => {
    if (!domain || !domain.trim()) return false;
    if (url.indexOf(domain) != -1) return true;
  });
  return !!one;
}
