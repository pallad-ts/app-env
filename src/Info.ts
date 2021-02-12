import {Env} from "./Env";
import {Builder} from './Builder';

export interface Info {
    name: Env;
    isTest: boolean;
    isProduction: boolean;
    isDevelopment: boolean;
    isStaging: boolean;
    isCI: boolean;

    build: () => Builder<undefined>;

    /**
     * Returns provided value for provided env names environment. Otherwise return undefined;
     */
    forEnv(...names: Env[]): Info.ValueGetter;

    /**
     * Returns provided value for TEST environment. Otherwise returns default value;
     */

    forTest: Info.ValueGetter

    /**
     * Returns provided value for PRODUCTION environment. Otherwise return undefined;
     */
    forProduction: Info.ValueGetter

    /**
     * Returns provided value for DEVELOPMENT environment. Otherwise return undefined;
     */
    forDevelopment: Info.ValueGetter

    /**
     * Returns provided value for STAGING environment. Otherwise return undefined;
     */
    forStaging: Info.ValueGetter

    /**
     * Returns
     */
    forCI: Info.ValueGetter;

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

    export interface ValueGetter {
        <T>(value: T): T | undefined;
        <T, TDefault>(value: T, defaultValue: TDefault): T | TDefault;
    }
}
