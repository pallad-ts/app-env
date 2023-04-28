import {Env} from "./Env";
import {isCI} from './isCI';

function fallback(env: typeof process['env']) {
	if (isCI(env)) {
		return 'ci';
	}
	return 'development';
}

export function getEnvNameFromProcess(env: typeof process['env'] = process.env, keys: string[] = ['APP_ENV', 'NODE_ENV']): Env {
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
		if (Env.List.includes(candidate.trim().toLowerCase() as any)) {
			return candidate as Env;
		}
	}
	return fallback(env);
}
