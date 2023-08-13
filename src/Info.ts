import {Env} from "./Env";
import {Builder} from './Builder';

export interface Info<T extends Env<string>> {
	name: Env<T>;
	isTest: boolean;
	isProduction: boolean;
	isDevelopment: boolean;
	isStaging: boolean;
	isCI: boolean;
	isCi: boolean;
	isPreview: boolean;

	build: () => Builder<undefined, Info<T>>;

	/**
	 * Returns provided value for provided env names environment, otherwise return undefined;
	 */
	forEnv(...names: Array<Env<T>>): Info.ValueGetter;

	/**
	 * Returns provided value for TEST environment, otherwise returns default value;
	 */
	forTest: Info.ValueGetter

	/**
	 * Returns provided value for PRODUCTION environment, otherwise return undefined;
	 */
	forProduction: Info.ValueGetter

	/**
	 * Returns provided value for DEVELOPMENT environment, otherwise return undefined;
	 */
	forDevelopment: Info.ValueGetter

	/**
	 * Returns provided value for STAGING environment, otherwise return undefined;
	 */
	forStaging: Info.ValueGetter

	/**
	 * Returns provided value for CI environment, otherwise returns undefined;
	 */
	forPreview: Info.ValueGetter;

	/**
	 * Returns provided value for CI environment, otherwise returns undefined;
	 */
	forCI: Info.ValueGetter;
	forCi: Info.ValueGetter;

	/**
	 * Checks if current env is one of provided env
	 */
	is(...names: Array<Env<T>>): boolean;

	/**
	 * Alias for "is"
	 */
	isEnv(...names: Array<Env<T>>): boolean;
};

export namespace Info {
	export interface ValueGetter {
		<T>(value: T): T | undefined;

		<T, TDefault>(value: T, defaultValue: TDefault): T | TDefault;
	}

	export type InferEnvNames<T> = T extends Info<infer TNames> ? Env<TNames> : never;
}
