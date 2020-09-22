import {Env} from "@src/Env";
import {create} from "@src/create";

describe('create', () => {
    it.each<[Env, { [key: string]: boolean }]>([
        [Env.STAGING, {isStaging: true}],
        [Env.TESTING, {isTesting: true}],
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
                isTesting: false,
                ...expectedIsState
            });

        expect(info.is(env))
            .toEqual(true);
    });
    

});