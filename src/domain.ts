export function isInDomain(domains: string[], url: string) {
  if (!domains || !domains.length) return false;
  if (domains.indexOf("*") !== -1) return true;
  const one = domains.find(domain => {
    if (!domain || !domain.trim()) return false;
    return url.indexOf(domain) !== -1;
  });
  return !!one;
}
