import {Env} from "@src/Env";
import {create} from "@src/create";

describe('create', () => {
    const PRODUCTION = create(Env.PRODUCTION);
    const DEVELOPMENT = create(Env.DEVELOPMENT);
    const TEST = create(Env.TEST);
    const STAGING = create(Env.STAGING);

    it.each<[Env, { [key: string]: boolean }]>([
        [Env.STAGING, {isStaging: true}],
        [Env.TEST, {isTest: true}],
        [Env.DEVELOPMENT, {isDevelopment: true}],
        [Env.PRODUCTION, {isProduction: true}]
    ])('for env: %s', (env, expectedIsState) => {
        const info = create(env);

        expect(info)
            .toMatchObject({
                name: env,
                isProduction: false,
                isStaging: false,
                isDevelopment: false,
                isTest: false,
                ...expectedIsState
            });

        expect(info.is(env))
            .toEqual(true);
    });

    const VALUE = 'FOO';
    it('forEnv returns value only for given environments', () => {
        expect(PRODUCTION.forEnv(Env.PRODUCTION)(VALUE)).toEqual(VALUE);
        expect(DEVELOPMENT.forEnv(Env.PRODUCTION)(VALUE)).toBeUndefined();
    });
});
