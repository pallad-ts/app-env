import {Info} from './Info';
import {Builder as BaseBuilder} from '@pallad/builder';
import {Env} from "./Env";

export class Builder<T extends NonNullable<any>, TInfo extends Info<Env<string>>> extends BaseBuilder {
	private found = false;
	private value!: T;

	constructor(readonly info: TInfo) {
		super();
	}

	static create<TInfo extends Info<any>>(info: TInfo) {
		return new Builder<undefined, TInfo>(info);
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

	forEnv<TN>(names: Array<Info.InferEnvNames<TInfo>>, value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.is(...names), value);
	}

	forCI<TN>(value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.isCI, value);
	}

	forProduction<TN>(value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.isProduction, value);
	}

	forTest<TN>(value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.isTest, value);
	}

	forDevelopment<TN>(value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.isDevelopment, value);
	}

	forPreview<TN>(value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.isPreview, value);
	}

	forStaging<TN>(value: TN): Builder<T | TN, TInfo> {
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
