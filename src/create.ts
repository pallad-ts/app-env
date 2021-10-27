import {Env} from "./Env";
import {Info} from "./Info";
import {Builder} from './Builder';

export function create(env: Env): Info {
	const is = (...names: Env[]) => {
		return names.includes(env);
	};

	const forEnv = (...names: Env[]) => {
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
		isDevelopment: env === 'development',
		forEnv,
		build: () => {
			return Builder.create(info);
		},
		forDevelopment: forEnv('development'),
		forProduction: forEnv('production'),
		forStaging: forEnv('staging'),
		forTest: forEnv('test'),
		forCI: forEnv('ci'),
		is,
		isEnv: is
	};
	return info;
}
