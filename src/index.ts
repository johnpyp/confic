import { isPlainObject, isNumber, isFullString } from "is-what";
import { constantCase } from "case-anything";
import fs from "fs";
import JSON5 from "json5";

const shallowClone = (obj: object) => {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
};

const confic = <T extends object>(
  config: T,
  { inspect, parentTree }: { inspect?: boolean; parentTree?: string } = {}
) => {
  let configCopy: T;

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
      let value: number | boolean | string | undefined = isNumber(
        (configCopy as any)[key]
      )
        ? Number(envVar)
        : envVar;
      if (value === "true") value = true;
      if (value === "false") value = false;

      Object.defineProperty(configCopy, key, {
        value,
      });

      return;
    }

    let value = (configCopy as any)[key];
    if (value === null) {
      throw new Error(`Required key ${envKey} not found in environment.`);
    }

    if (isPlainObject(value)) {
      (configCopy as any)[key] = confic(value, {
        parentTree: dotPath,
      });
    }
  });

  const final = Object.freeze(configCopy);
  if (inspect) console.log(final);

  return final;
};

export default confic;
