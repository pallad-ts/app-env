import {getEnvNameFromProcess} from "@src/getEnvNameFromProcess";
import {Env} from "@src/Env";

describe('getEnvNameFromProcess', () => {
    it('using default keys: APP_ENV, NODE_ENV', () => {
        expect(getEnvNameFromProcess({APP_ENV: Env.PRODUCTION}))
            .toEqual(Env.PRODUCTION);

        expect(getEnvNameFromProcess({NODE_ENV: Env.PRODUCTION}))
            .toEqual(Env.PRODUCTION);
    });


    it('fallback to development is missing', () => {
        expect(getEnvNameFromProcess({}))
            .toEqual(Env.DEVELOPMENT)
    });

    it('using provided keys', () => {
        const env = {
            APP_ENV: Env.TEST,
            NODE_ENV: Env.PRODUCTION
        };

        expect(getEnvNameFromProcess(env, ['NODE_ENV']))
            .toEqual(Env.PRODUCTION);
    });

    it('unknown env are treated as DEVELOPMENT', () => {
        expect(getEnvNameFromProcess({APP_ENV: 'wtf?'}))
            .toEqual(Env.DEVELOPMENT);
    });

    describe('using process.env', () => {

        let env: typeof process['env'];
        beforeEach(() => {
            env = process.env;
            process.env = {
                ...env,
                APP_ENV: Env.STAGING
            };
        });

        afterAll(() => {
            process.env = env;
        });

        it('as default', () => {
            expect(getEnvNameFromProcess())
                .toEqual(Env.STAGING);
        });
    })
});
