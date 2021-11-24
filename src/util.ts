export const isNil = (value: any) => value === undefined || value === null;

export const cleanShallowObject = <T>(obj: T): T => {
  let copy = { ...obj } as Record<string, any>;
  Object.entries(copy).map(([value, key]) => {
    if (isNil(value)) {
      delete copy[key];
    }
  });

  return copy as T;
};
