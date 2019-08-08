

export function only<T, K extends keyof T>(target: T, ...members: K[]): Pick<T, K> {
  const copy: Partial<T> = {};
  members.forEach(member => copy[member] = target[member]);
  return copy as Pick<T, K>;
}
