import {isBoolean} from "is-what";
import {ConficOpts} from "./confic";
import {isNil} from "./util";

export class BaseError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class ConficError extends BaseError {}

export class ConficAssertionError extends ConficError {}

export class ConficRefiner<T> {
  private opts: ConficOpts;
  constructor(opts: ConficOpts) {
    this.opts = opts;

  }

  public value(): T {
    return this.getValue()
  }

  private getValue(): any {
    const envValues = this.getEnvValues()
  }

  private tryGetValues(vs: any[]): any[] {
    let e: Error;
    for (const v of vs) {

    try {
      const result = this.tryGetValue(v)
      if (isNil(result)) continue;
      return result
    } catch (error) {
      e = error;
    }
    }
    
  }

  private tryGetValue(v: any): any {
    const value = this.routeTypes(v)
    if (value === undefined || value === null) {
      if (this.opts.optional) return undefined;
      throw new ConficAssertionError("Config option is required, but no value found")
    }
    
  }

  private routeTypes(value: any): any {
    if (this.opts.castType === "boolean") return this.refineBoolean()
  }

  private refineBoolean(value: any): boolean | undefined {
    if (!isBoolean())
    this.opts.
    
  }

  private getEnvValues(): string[] {
    if (!this.opts.envFunctions) return []

    return this.opts.envFunctions.map(fn => fn()).flatMap(v => v === undefined ? [] : [v])
  }
}
