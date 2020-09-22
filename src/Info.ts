import {Env} from "./Env";

export interface Info {
    name: Env;
    isTesting: boolean;
    isProduction: boolean;
    isDevelopment: boolean;
    isStaging: boolean;

    /**
     * Checks if current env is one of provided env
     */
    is(...names: string[]): boolean;
}