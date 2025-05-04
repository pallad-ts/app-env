import {AnyInfo, Info, InfoInferEnvNames} from "./Info";
import {Builder as BaseBuilder} from '@pallad/builder';

export class Builder<T = undefined, TInfo extends AnyInfo = AnyInfo> extends BaseBuilder {
	private found = false;
	private value!: T;

	constructor(readonly info: TInfo) {
		super();
	}

	private evalRule(isValid: boolean, value: any): any {
		if (this.found) {
			return this;
		}
		if (isValid) {
			this.found = true;
			this.value = value instanceof Function ? value(this.info) : value;
		}
		return this;
	}

	forEnv<TN>(names: Array<InfoInferEnvNames<TInfo>>, value: TN | ((info: TInfo) => TN)): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.is(...names), value);
	}

	forCI<TN>(value: TN): Builder<T | TN, TInfo> {
		return this.evalRule(this.info.isCi, value);
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
