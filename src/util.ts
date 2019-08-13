

export function only<T, K extends keyof T>(target: T, ...members: K[]): Pick<T, K> {
  const copy: Partial<T> = {};
  members.forEach(member => target[member] !== undefined && (copy[member] = target[member]));
  return copy as Pick<T, K>;
}
