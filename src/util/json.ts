export type JsonParser = (key: string, value: unknown) => unknown;
export type JsonStringifier = (key: string, value: unknown) => unknown;

export interface JsonSerializer {
  parse: JsonParser;
  stringify: JsonStringifier;
}

export const dateSerializer: JsonSerializer = {
  parse(key, value) {
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d\d-\d\d(?:T\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?)?(?:[+-]\d\d?(?::?\d\d)?Z?)?$/.test(value)
    )
      return value;
    return new Date(value);
  },
  stringify(key, value) {
    if (typeof value !== "object" || !value || !(value instanceof Date)) return value;
    return value.toISOString();
  },
};

export function at<T, Key extends keyof T>(key: Key): (el: T) => T[Key] {
  return (el) => el?.[key] as never;
}

export type StringSerializer = Pick<typeof JSON, "stringify" | "parse">;

export function json(serializers: JsonSerializer[] = []): StringSerializer {
  const combine = (mutators: (JsonParser | JsonStringifier)[]): JsonParser | JsonStringifier => {
    return (key, value) => mutators.filter((it) => it).reduce((value, mutator) => mutator(key, value), value);
  };

  const parse = combine(serializers.map(at("parse")));
  const stringify = combine(serializers.map(at("stringify")));

  return {
    parse(text, reviver) {
      if (reviver) return JSON.parse(text, combine([reviver, parse]));
      else return JSON.parse(text, parse);
    },
    stringify(value, replacer, space) {
      if (replacer) return JSON.stringify(value, combine([stringify, value]), space);
      else return JSON.stringify(value, stringify, space);
    },
  };
}
