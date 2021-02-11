import {Env} from './Env';
import {Info} from './Info';

export class Builder<T> {
    private found = false;
    private value?: T;

    constructor(readonly info: Info) {
    }

    private evalRule(isValid: boolean, value: T): this {
        if (this.found) {
            return this;
        }
        if (isValid) {
            this.found = true;
            this.value = value;
        }
        return this;
    }

    forEnv(names: Env[], value: T) {
        return this.evalRule(this.info.is(...names), value);
    }

    forProduction(value: T) {
        return this.evalRule(this.info.isProduction, value);
    }

    forTest(value: T) {
        return this.evalRule(this.info.isTest, value);
    }

    forDevelopment(value: T) {
        return this.evalRule(this.info.isDevelopment, value);
    }

    forStaging(value: T) {
        return this.evalRule(this.info.isStaging, value);
    }

    default(value: T) {
        return this.evalRule(true, value);
    }

    get() {
        return this.value;
    }
}
