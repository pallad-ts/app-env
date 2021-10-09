import {Env} from './Env';
import {Info} from './Info';

export class Builder<T extends NonNullable<any>> {
    private found = false;
    private value!: T;

    constructor(readonly info: Info) {
    }

    static create(info: Info) {
        return new Builder<undefined>(info);
    }

    private evalRule(isValid: boolean, value: any): any {
        if (this.found) {
            return this;
        }
        if (isValid) {
            this.found = true;
            this.value = value as any;
        }
        return this;
    }

    forEnv<NT>(names: Env[], value: NT): Builder<T | NT> {
        return this.evalRule(this.info.is(...names), value);
    }

    forCI<TN>(value: TN): Builder<T | TN> {
        return this.evalRule(this.info.isCI, value);
    }

    forProduction<TN>(value: TN): Builder<T | TN> {
        return this.evalRule(this.info.isProduction, value);
    }

    forTest<TN>(value: TN): Builder<T | TN> {
        return this.evalRule(this.info.isTest, value);
    }

    forDevelopment<TN>(value: TN): Builder<T | TN> {
        return this.evalRule(this.info.isDevelopment, value);
    }

    forStaging<TN>(value: TN): Builder<T | TN> {
        return this.evalRule(this.info.isStaging, value);
    }

    get(): T {
        return this.value;
    }

    getOrDefault<TN>(value: TN): NonNullable<T> | TN {
        if (this.found) {
            return this.value as NonNullable<T>;
        }
        return value;
    }
}
