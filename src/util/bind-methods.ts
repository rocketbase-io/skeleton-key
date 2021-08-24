export function bindMethods<T extends Record<string, unknown>>(
  instance: T,
  target: Record<string, unknown> = instance
): T {
  for (const [key, value] of Object.entries(target)) {
    switch (typeof value) {
      case "function":
        target[key] = value.bind(instance);
        break;
      case "object":
        if (value != null) bindMethods(instance, value as never);
        break;
    }
  }
  return instance;
}
