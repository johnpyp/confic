import { isPlainObject, isNumber } from "is-what";
import { constantCase } from "case-anything";

const shallowClone = obj => {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
};

const confic = (config, { inspect, parentTree } = {}) => {
  const configCopy = shallowClone(config);

  Object.keys(configCopy).forEach(key => {
    const dotPath = parentTree ? `${parentTree}.${key}` : key;
    const envKey = constantCase(dotPath);
    const envVar = process.env[envKey];

    if (envVar) {
      const value = isNumber(configCopy[key]) ? Number(envVar) : envVar;

      Object.defineProperty(configCopy, key, {
        value
      });

      return;
    }

    if (configCopy[key] === null) {
      throw new Error(`Required key ${envKey} not found in environment.`);
    }

    if (isPlainObject(configCopy[key])) {
      configCopy[key] = confic(configCopy[key], {
        parentTree: dotPath
      });
    }
  });

  const final = Object.freeze(configCopy);
  if (inspect) console.log(final);

  return final;
};

export default confic;
