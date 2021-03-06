import {getEnvNameFromProcess} from "@src/getEnvNameFromProcess";

describe('getEnvNameFromProcess', () => {
    it('using default keys: APP_ENV, NODE_ENV', () => {
        expect(getEnvNameFromProcess({APP_ENV: 'production'}))
            .toEqual('production');

        expect(getEnvNameFromProcess({NODE_ENV: 'production'}))
            .toEqual('production');
    });


    it('fallbacks to development if missing', () => {
        expect(getEnvNameFromProcess({}))
            .toEqual('development')
    });

    describe('CI', () => {
        it('might be provided in APP_ENV', () => {
            expect(getEnvNameFromProcess({APP_ENV: 'ci'}))
                .toEqual('ci');
        });

        it('might be provided in NODE_ENV', () => {
            expect(getEnvNameFromProcess({NODE_ENV: 'ci'}))
                .toEqual('ci');
        });

        it.each([
            ['CI'],
            ['CONTINUOUS_INTEGRATION'],
            ['BUILD_NUMBER'],
            ['RUN_ID']
        ])('to CI if ENV variable %s is present', envName => {
            expect(getEnvNameFromProcess({[envName]: '1'}))
                .toEqual('ci');
        });
    });

    it('using provided keys', () => {
        const env = {
            APP_ENV: 'test',
            NODE_ENV: 'production'
        };

        expect(getEnvNameFromProcess(env, ['NODE_ENV']))
            .toEqual('production');
    });

    it('unknown env are treated as DEVELOPMENT', () => {
        expect(getEnvNameFromProcess({APP_ENV: 'wtf?'}))
            .toEqual('development');
    });

    describe('using process.env', () => {
        let env: typeof process['env'];
        beforeEach(() => {
            env = process.env;
            process.env = {
                ...env,
                APP_ENV: 'staging'
            };
        });

        afterAll(() => {
            process.env = env;
        });

        it('as default', () => {
            expect(getEnvNameFromProcess())
                .toEqual('staging');
        });
    })
});
