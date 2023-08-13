import {Env} from "./Env";
import {isCI} from "./isCI";
import {Info} from "./Info";
import {Builder} from "./Builder";

export class Configuration<T extends string> {
	private environmentNames = new Set<Env<T>>(Env.List)

	constructor(extraEnvironments: readonly T[]) {
		for (const env of extraEnvironments) {
			this.environmentNames.add(env.toLowerCase() as Lowercase<T>);
		}
	}

	isEnvironmentNameAvailable(name: string): name is Env<T> {
		return this.environmentNames.has(name as any);
	}

	getEnvironmentNames() {
		return Array.from(this.environmentNames);
	}

	getNonStandardEnvironmentNames() {
		return this.getEnvironmentNames()
			.filter(x => !Env.List.includes(x as any));
	}

	getEnvNameFromProcess(env: typeof process['env'] = process.env, keys: string[] = ['APP_ENV', 'NODE_ENV']): Env<T> {
		// See #1 for details
		if (env === process.env) {
			env.NODE_ENV = process.env.NODE_ENV; // this might be replaced by bundler
		}

		const candidates: string[] = keys.map(x => env[x])
			.filter(x => x) as string[];

		if (candidates.length === 0) {
			return fallback(env);
		}

		for (const candidate of candidates) {
			const sanitizedCandidate = candidate.trim().toLowerCase();
			if (this.isEnvironmentNameAvailable(sanitizedCandidate)) {
				return sanitizedCandidate;
			}
		}
		return fallback(env);
	}

	create<T extends string>(env: Env<T>): Info<Env<T>> {
		const is = (...names: Array<Env<T>>) => {
			return names.includes(env);
		};

		const forEnv = (...names: Array<Env<T>>) => {
			const func: Info.ValueGetter = (value: any, defaultValue?: any) => {
				if (is(...names)) {
					return value
				}
				return defaultValue;
			};
			return func;
		};

		const info = {
			name: env,
			isTest: env === 'test',
			isProduction: env === 'production',
			isStaging: env === 'staging',
			isCI: env === 'ci',
			isCi: env === 'ci',
			isDevelopment: env === 'development',
			isPreview: env === 'preview',
			forEnv,
			build: () => {
				return Builder.create(info);
			},
			forDevelopment: forEnv('development'),
			forProduction: forEnv('production'),
			forStaging: forEnv('staging'),
			forTest: forEnv('test'),
			forCI: forEnv('ci'),
			forCi: forEnv('ci'),
			forPreview: forEnv('preview'),
			is,
			isEnv: is
		};
		return info;
	}
}

function fallback(env: typeof process['env']) {
	if (isCI(env)) {
		return 'ci';
	}
	return 'development';
}
