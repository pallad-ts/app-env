import {Env} from "./Env";

export function getEnvNameFromProcess(env = process.env, keys: string[] = ['APP_ENV', 'NODE_ENV']): Env {
    const candidate = (() => {
        for (const envName of keys) {
            if (env[envName]) {
                return env[envName];
            }
        }
    })();

    if (candidate === undefined) {
        return Env.DEVELOPMENT;
    }

    const values = Object.values(Env) as string[];
    if (values.includes(candidate.trim().toLowerCase())) {
        return candidate as Env;
    }

    return Env.DEVELOPMENT;
}