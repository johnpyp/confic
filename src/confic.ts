type EnvFunction = () => string | undefined;
export type CastTypes = "string" | "boolean" | "number";

export interface ConficOpts {
  castType: CastTypes;
  optional: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  stringFormat?: "uuid" | "email";
  stringPrefix?: string;
  envFunctions?: EnvFunction[];
}

export type ValueTypes = string | boolean | number | undefined;

export class Confic<T extends ValueTypes = string> {
  private opts: ConficOpts;

  constructor(opts: ConficOpts) {
    this.opts = opts;
  }

  private assertCastType(
    option: string,
    castType: CastTypes,
    ...castTypes: CastTypes[]
  ): void {
    const allCastTypes = [castType, ...castTypes];
    if (!allCastTypes.includes(this.opts.castType)) {
      throw new Error(
        `Current Confic type '${this.opts.castType}' is not compatible with '${option}' options.`
      );
    }
  }

  private _new<NewT extends ValueTypes = T>(
    nextOpts: Partial<ConficOpts>
  ): Confic<NewT> {
    return new Confic({
      ...this.opts,
      ...nextOpts,
    });
  }

  public static create(): Confic {
    return new Confic({
      optional: false,
      castType: "string",
    });
  }

  public castString(): Confic<string> {
    return this._new({ castType: "string", optional: false });
  }

  public castNumber({ min, max }: { min?: number; max?: number } = {}): Confic<
    number
  > {
    return this._new({ castType: "number", min, max, optional: false });
  }

  public castBoolean(): Confic<boolean> {
    return this._new({ castType: "boolean", optional: false });
  }

  public optional(): Confic<T | undefined> {
    return this._new({ optional: true });
  }

  public min(min: number): Confic<T> {
    this.assertCastType("min", "number");
    return this._new({ min });
  }

  public max(max: number): Confic<T> {
    this.assertCastType("max", "number");
    return this._new({ max });
  }

  public minLength(minLength: number): Confic<T> {
    this.assertCastType("minLength", "string");
    return this._new({ minLength: minLength });
  }

  public maxLength(maxLength: number): Confic<T> {
    this.assertCastType("maxLength", "string");
    return this._new({ maxLength: maxLength });
  }

  public email(): Confic<T> {
    this.assertCastType("email", "string");
    return this._new({ stringFormat: "email" });
  }

  public uuid(): Confic<T> {
    this.assertCastType("uuid", "string");
    return this._new({ stringFormat: "uuid" });
  }

  public requiredPrefix(prefix: string): Confic<T> {
    this.assertCastType("prefix", "string");
    return this._new({ stringPrefix: prefix });
  }

  public env(fn: EnvFunction): Confic<T>;
  public env(keyName: string): Confic<T>;
  public env(v: EnvFunction | string): Confic<T> {
    let envFn: EnvFunction;
    if (typeof v === "string") {
      envFn = () => process.env[v];
    } else {
      envFn = v;
    }
    return this._new({
      envFunctions: [...(this.opts.envFunctions ?? []), envFn],
    });
  }

  public required(): Confic<Exclude<T, undefined>> {
    return this._new({ optional: false });
  }

  public value(): T {
    return this._getValue();
  }

  private _getValue(): any {
    const opts = this.opts;
    if (opts.castType === "boolean") return true;
  }
}

const value = Confic.create().min(5);
