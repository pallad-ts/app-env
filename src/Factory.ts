import {StandardEnvName, StandardEnvNameList} from "./StandardEnvName";
import {isCI} from "./isCI";
import {NoEnvironmentNameFoundError} from "./error/NoEnvironmentNameFoundError";
import {Info, InfoValueGetter} from "./Info";
import {Builder} from "./Builder";

const DEFAULT_ENV_NAME_ENV_KEYS = ['APP_ENV', 'NODE_ENV'];
const DEFAULT_ENV_ID_ENV_KEYS = ['APP_ENV_ID'];

export class Factory<T extends Lowercase<string> = StandardEnvName, TEnvId extends string = string> {
	constructor(private config: FactoryConfig<T, TEnvId>) {
		if (this.config.envName) {
			this.config.envName = this.config.envName.map(name => name.toLowerCase()) as T[];
		}
	}

	get supportedEnvNames() {
		return this.config.envName ?? StandardEnvNameList
	}

	isValidEnvName(name: string): name is T {
		return this.supportedEnvNames.includes(name as never);
	}

	isValidEnvId(id: unknown): id is TEnvId {
		if (this.config.validateEnvId) {
			return this.config.validateEnvId(id);
		}
		return id === undefined || typeof id === 'string';
	}

	createFromProcessEnv(env: typeof process['env'] = process.env) {
		return this.create(this.getEnvNameFromProcess(env), this.getEnvIdFromProcess(env) as never);
	}

	getEnvNameFromProcess(env: typeof process['env'] = process.env): T {
		const envKeyNames = this.config.envNameEnvKeys ?? DEFAULT_ENV_NAME_ENV_KEYS;
		for (const envKey of envKeyNames) {
			const candidate = (env[envKey] ?? '').trim().toLowerCase();

			if (candidate && this.isValidEnvName(candidate)) {
				return candidate;
			}
		}

		if (isCI(env) && this.isValidEnvName('ci')) {
			return 'ci' as T;
		}

		if (this.isValidEnvName('development')) {
			return 'development' as T;
		}

		throw NoEnvironmentNameFoundError.fromConfig(envKeyNames, this.supportedEnvNames.slice());
	}

	getEnvIdFromProcess(env: typeof process['env'] = process.env): TEnvId | undefined {
		const envKeyNames = this.config.envIdEnvKeys ?? DEFAULT_ENV_ID_ENV_KEYS;
		for (const envKey of envKeyNames) {
			const candidate = (env[envKey] ?? '').trim().toLowerCase();

			if (candidate && this.isValidEnvId(candidate)) {
				return candidate as TEnvId;
			}
		}
	}

	create(env: T, envId?: TEnvId): Info<T, TEnvId | undefined> {
		const is = (...names: T[]) => {
			return names.includes(env);
		};
		const forEnv = (...names: T[]) => {
			const func: InfoValueGetter = (value: any, defaultValue?: any) => {
				if (is(...names)) {
					return value
				}
				return defaultValue;
			};
			return func;
		};


		const info: Info<T, TEnvId | undefined> = {
			name: env,
			id: envId,
			forEnv,
			forProduction: forEnv('production' as never),
			forStaging: forEnv('staging' as never),
			forCi: forEnv('ci' as never),
			forCI: forEnv('ci' as never),
			forDevelopment: forEnv('development' as never),
			forTest: forEnv('test' as never),
			forPreview: forEnv('preview' as never),
			is,
			isProduction: is('production' as never),
			isStaging: is('staging' as never),
			isCi: is('ci' as never),
			isCI: is('ci' as never),
			isDevelopment: is('development' as never),
			isTest: is('test' as never),
			isPreview: is('preview' as never),
			isEnv: is,
			build() {
				return new Builder(info);
			},
			isEnvId: (...names: TEnvId[]) => {
				return names.includes(envId as never);
			}
		};
		return info;
	}
}

export interface FactoryConfig<T extends Lowercase<string>, TEnvId extends string | undefined> {
	/**
	 * List of supported environments.
	 *
	 * By default all standard environments apply
	 */
	envName?: T[];

	/**
	 * List of environment variable keys (in order from) considered for env name
	 *
	 * By default uses 'APP_ENV', 'NODE_ENV'
	 */
	envNameEnvKeys?: string[];

	/**
	 * List of environment variable keys (in order from) considered for env id
	 *
	 * By default uses 'APP_ENV_ID'
	 */
	envIdEnvKeys?: string[];

	/**
	 * Function used to validate env id.
	 *
	 * By default accepts all envId
	 */
	validateEnvId?: (id: unknown) => id is TEnvId;
}

