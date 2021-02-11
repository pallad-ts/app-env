import {Env} from "./Env";
import {Builder} from './Builder';

export interface Info {
    name: Env;
    isTest: boolean;
    isProduction: boolean;
    isDevelopment: boolean;
    isStaging: boolean;

    build: <T>() => Builder<T>;

    /**
     * Returns provided value for provided env names environment. Otherwise return undefined;
     */
    forEnv(...names: Env[]): (<T>(value: T) => T | undefined);

    /**
     * Returns value that matches given env key. If none matches uses `default`
     */
    forEnvMap<T>(map: Info.EnvMap<T>): T | undefined;

    /**
     * Returns provided value for env names other than provided. Otherwise return undefined;
     */
    forEnvOtherThan(...names: Env[]): (<T>(value: T) => T | undefined);

    /**
     * Alias for "forEnvOtherThan"
     */
    forOtherThan(...names: Env[]): (<T>(value: T) => T | undefined)

    /**
     * Returns provided value for TEST environment. Otherwise return undefined;
     */
    forTest<T>(value: T): T | undefined;

    /**
     * Returns provided value for environments other than TEST. Otherwise return undefined;
     */
    forOtherThanTest<T>(value: T): T | undefined;

    /**
     * Returns provided value for PRODUCTION environment. Otherwise return undefined;
     */
    forProduction<T>(value: T): T | undefined;

    /**
     * Returns provided value for environments other than PRODUCTION. Otherwise return undefined;
     */
    forOtherThanProduction<T>(value: T): T | undefined;

    /**
     * Returns provided value for DEVELOPMENT environment. Otherwise return undefined;
     */
    forDevelopment<T>(value: T): T | undefined;

    /**
     * Returns provided value for environments other than DEVELOPMENT. Otherwise return undefined;
     */
    forOtherThanDevelopment<T>(value: T): T | undefined;

    /**
     * Returns provided value for STAGING environment. Otherwise return undefined;
     */
    forStaging<T>(value: T): T | undefined;

    /**
     * Returns provided value for environments other than STAGING. Otherwise return undefined;
     */
    forOtherThanStaging<T>(value: T): T | undefined;

    /**
     * Checks if current env is one of provided env
     */
    is(...names: Env[]): boolean;

    /**
     * Alias for "is"
     */
    isEnv(...names: Env[]): boolean;
}

export namespace Info {
    export type EnvMap<T> = Partial<Record<Env | 'default', T>>
}
