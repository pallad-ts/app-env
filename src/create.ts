import {Env} from "./Env";
import {Info} from "./Info";

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

    return {
        name: env,
        isTest: env === Env.TEST,
        isProduction: env === Env.PRODUCTION,
        isStaging: env === Env.STAGING,
        isDevelopment: env === Env.DEVELOPMENT,
        forEnv,
        forDevelopment: forEnv(Env.DEVELOPMENT),
        forProduction: forEnv(Env.PRODUCTION),
        forStaging: forEnv(Env.STAGING),
        forTest: forEnv(Env.TEST),
        is
    }
}
