export type AppEnvIdGuard<T> = (envName: unknown) => envName is T;
