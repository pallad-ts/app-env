import {Builder} from "./Builder";

export interface Info<T extends string, TId extends string | undefined> {
	name: T;
	id: TId;

	forEnv(...names: Array<T>): InfoValueGetter;

	is(...names: Array<T>): boolean;

	isEnv(...names: Array<T>): boolean;

	isEnvId(...names: Array<TId>): boolean;

	isProduction: boolean;
	isStaging: boolean;
	isCi: boolean;
	isCI: boolean;
	isDevelopment: boolean;
	isTest: boolean;
	isPreview: boolean;

	forProduction: InfoValueGetter;
	forStaging: InfoValueGetter;
	forCi: InfoValueGetter;
	forCI: InfoValueGetter;
	forDevelopment: InfoValueGetter;
	forTest: InfoValueGetter;
	forPreview: InfoValueGetter;

	build: () => Builder<undefined, Info<T, TId>>;
}

export type AnyInfo = Info<string, string | undefined>;

export interface InfoValueGetter {
	<T>(value: T): T | undefined;

	<T, TDefault>(value: T, defaultValue: TDefault): T | TDefault;
}

export type InfoInferEnvNames<T> = T extends Info<infer TNames, any> ? TNames : never;
export type InfoInferEnvId<T> = T extends Info<any, infer TId> ? TId : never;
