export function isCI(env: typeof process['env']) {
    return !!env.CI ||
        !!env.CONTINUOUS_INTEGRATION ||
        !!env.BUILD_NUMBER ||
        !!env.RUN_ID;
}
