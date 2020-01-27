export function only<T, K extends keyof T>(target: T, ...members: K[]): Pick<T, K> {
  const copy: Partial<T> = {};
  members.forEach(member => target[member] !== undefined && (copy[member] = target[member]));
  return copy as Pick<T, K>;
}

export function urlMatches(target: string, needle: string): boolean {
  return urlAbsolute(target).indexOf(urlAbsolute(needle)) !== -1;
}

export const urlAbsolute = (() => {
  if (window.URL) return (url: string) => new URL(url, window.location.href).href;
  let a: HTMLAnchorElement;
  /* istanbul ignore next */
  return (url: string) => {
    // IE Fallback
    if (!a) a = document.createElement("a");
    a.href = url;
    return a.href;
  };
})();
