import {Env} from './Env';
import {Info} from './Info';
import {Builder as BaseBuilder} from '@pallad/builder';

export class Builder<T extends NonNullable<any>> extends BaseBuilder {
	private found = false;
	private value!: T;

	constructor(readonly info: Info) {
		super();
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

	forEnv<TN>(names: Env[], value: TN): Builder<T | TN> {
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

	forPreview<TN>(value: TN): Builder<T | TN> {
		return this.evalRule(this.info.isPreview, value);
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
