import {Env} from "./Env";
import {isCI} from './isCI';

export function getEnvNameFromProcess(env = process.env, keys: string[] = ['APP_ENV', 'NODE_ENV']): Env {
    const candidate: string | undefined = (() => {
        for (const envName of keys) {
            if (env[envName]) {
                return env[envName];
            }
        }
    })();

    if (candidate === undefined) {
        if (isCI(env)) {
            return 'ci';
        }
        return 'development'
    }

    if (Env.List.includes(candidate.trim().toLowerCase() as any)) {
        return candidate as Env;
    }

    return 'development';
}
