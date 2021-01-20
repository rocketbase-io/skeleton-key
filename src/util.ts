import URI from "urijs";

export function only<T, K extends keyof T>(target: T, ...members: K[]): Pick<T, K> {
  const copy: Partial<T> = {};
  members.forEach(member => target[member] !== undefined && (copy[member] = target[member]));
  return copy as Pick<T, K>;
}

export function urlMatches(target: string, needle: string): boolean {
  return urlAbsolute(target).indexOf(urlAbsolute(needle)) !== -1;
}

export const urlAbsolute = (url: string) => new URI(url).absoluteTo(global?.location?.href).href();
