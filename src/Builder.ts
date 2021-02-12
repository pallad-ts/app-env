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

    forCI<NT>(value: NT): Builder<T | NT> {
        return this.evalRule(this.info.isCI, value);
    }

    forProduction<NT>(value: NT): Builder<T | NT> {
        return this.evalRule(this.info.isProduction, value);
    }

    forTest<NT>(value: NT): Builder<T | NT> {
        return this.evalRule(this.info.isTest, value);
    }

    forDevelopment<NT>(value: NT): Builder<T | NT> {
        return this.evalRule(this.info.isDevelopment, value);
    }

    forStaging<NT>(value: NT): Builder<T | NT> {
        return this.evalRule(this.info.isStaging, value);
    }

    get(): T {
        return this.value;
    }

    getOrDefault<NT>(value: NT): NonNullable<T> | NT {
        if (this.found) {
            return this.value as NonNullable<T>;
        }
        return value;
    }
}
