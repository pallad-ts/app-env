import {Env} from "./Env";
import {Info} from "./Info";

export function create(env: Env): Info {
    return {
        name: env,
        isTesting: env === Env.TESTING,
        isProduction: env === Env.PRODUCTION,
        isStaging: env === Env.STAGING,
        isDevelopment: env === Env.DEVELOPMENT,
        is(...names: string[]) {
            return names.includes(env);
        }
    }
}