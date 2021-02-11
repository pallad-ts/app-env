import {Env} from "./Env";

export interface Info {
    name: Env;
    isTest: boolean;
    isProduction: boolean;
    isDevelopment: boolean;
    isStaging: boolean;

    /**
     * Returns provided value for provided env names environment. Otherwise return undefined;
     */
    forEnv(...names: Env[]): (<T>(value: T) => T | undefined)

    /**
     * Returns provided value for testing environment. Otherwise return undefined;
     */
    forTest<T>(value: T): T | undefined;

    /**
     * Returns provided value for production environment. Otherwise return undefined;
     */
    forProduction<T>(value: T): T | undefined;

    /**
     * Returns provided value for development environment. Otherwise return undefined;
     */
    forDevelopment<T>(value: T): T | undefined;

    /**
     * Returns provided value for staging environment. Otherwise return undefined;
     */
    forStaging<T>(value: T): T | undefined;

    /**
     * Checks if current env is one of provided env
     */
    is(...names: Env[]): boolean;
}
