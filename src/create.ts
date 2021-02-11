import {Env} from "./Env";
import {Info} from "./Info";
import {Builder} from './Builder';

export function create(env: Env): Info {
    const is = (...names: Env[]) => {
        return names.includes(env);
    };

    const forEnv = (...names: Env[]) => {
        return <T>(value: T) => {
            if (is(...names)) {
                return value
            }
        };
    };

    const forOtherThan = (...names: Env[]) => {
        return <T>(value: T) => {
            if (!is(...names)) {
                return value;
            }
        }
    }

    const info = {
        name: env,
        isTest: env === 'test',
        isProduction: env === 'production',
        isStaging: env === 'staging',
        isDevelopment: env === 'development',
        forEnv,
        build: <T>(): Builder<T> => {
            return new Builder(info);
        },
        forOtherThan,
        forEnvOtherThan: forOtherThan,
        forEnvMap<T>(map: Info.EnvMap<T>): T | undefined {
            for (const envName of Env.List) {
                if (envName in map && env === envName) {
                    return map[envName];
                }
            }

            if ('default' in map) {
                return map.default;
            }
        },
        forDevelopment: forEnv('development'),
        forOtherThanDevelopment: forOtherThan('development'),
        forProduction: forEnv('production'),
        forOtherThanProduction: forOtherThan('production'),
        forStaging: forEnv('staging'),
        forOtherThanStaging: forOtherThan('staging'),
        forTest: forEnv('test'),
        forOtherThanTest: forOtherThan('test'),
        is,
        isEnv: is
    };
    return info;
}
