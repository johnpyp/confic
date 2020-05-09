import { isPlainObject, isNumber, isFullString } from "is-what";
import { constantCase } from "case-anything";
import fs from "fs";
import JSON5 from "json5";

const shallowClone = (obj) => {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
};

const confic = (config, { inspect, parentTree } = {}) => {
  let configCopy;

  if (isFullString(config)) {
    if (config.endsWith(".json")) {
      configCopy = JSON.parse(fs.readFileSync(config, "utf8"));
    } else if (config.endsWith(".json5")) {
      configCopy = JSON5.parse(fs.readFileSync(config, "utf8"));
    } else {
      throw new Error("File format not supported");
    }
  } else {
    configCopy = shallowClone(config);
  }

  Object.keys(configCopy).forEach((key) => {
    const dotPath = parentTree ? `${parentTree}.${key}` : key;
    const envKey = constantCase(dotPath);
    const envVar = process.env[envKey];

    if (envVar) {
      let value = isNumber(configCopy[key]) ? Number(envVar) : envVar;
      if (value === "true") value = true;
      if (value === "false") value = false;

      Object.defineProperty(configCopy, key, {
        value,
      });

      return;
    }

    if (configCopy[key] === null) {
      throw new Error(`Required key ${envKey} not found in environment.`);
    }

    if (isPlainObject(configCopy[key])) {
      configCopy[key] = confic(configCopy[key], {
        parentTree: dotPath,
      });
    }
  });

  const final = Object.freeze(configCopy);
  if (inspect) console.log(final);

  return final;
};

export default confic;
