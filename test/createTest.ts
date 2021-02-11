import {Env} from "@src/Env";
import {create} from "@src/create";
import {Info} from '@src/Info';

describe('create', () => {
    const PRODUCTION = create('production');
    const DEVELOPMENT = create('development');
    const TEST = create('test');
    const STAGING = create('staging');

    it.each<[Env, { [key: string]: boolean }]>([
        ['staging', {isStaging: true}],
        ['test', {isTest: true}],
        ['development', {isDevelopment: true}],
        ['production', {isProduction: true}]
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
    const VALUE_2 = 'BAR';

    it('forEnv returns value only for given environments', () => {
        expect(PRODUCTION.forEnv('production')(VALUE)).toEqual(VALUE);
        expect(DEVELOPMENT.forEnv('production')(VALUE)).toBeUndefined();
    });

    describe('forEnvMap', () => {
        it('no default', () => {
            const map: Info.EnvMap<any> = {
                production: VALUE
            };

            expect(PRODUCTION.forEnvMap(map)).toEqual(VALUE);
            expect(DEVELOPMENT.forEnvMap(map)).toBeUndefined();
        });

        it('with default', () => {
            const map: Info.EnvMap<any> = {
                production: VALUE,
                default: VALUE_2
            };

            expect(PRODUCTION.forEnvMap(map)).toEqual(VALUE);
            expect(DEVELOPMENT.forEnvMap(map)).toEqual(VALUE_2);
            expect(TEST.forEnvMap(map)).toEqual(VALUE_2);
            expect(STAGING.forEnvMap(map)).toEqual(VALUE_2);
        });
    });

    it('forOtherThan', () => {
        expect(PRODUCTION.forOtherThan('development')(VALUE))
            .toEqual(VALUE);

        expect(DEVELOPMENT.forOtherThan('development')(VALUE))
            .toBeUndefined();
    });
});
