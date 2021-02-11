import {getEnvNameFromProcess} from "@src/getEnvNameFromProcess";
import {Env} from "@src/Env";

describe('getEnvNameFromProcess', () => {
    it('using default keys: APP_ENV, NODE_ENV', () => {
        expect(getEnvNameFromProcess({APP_ENV: 'production'}))
            .toEqual('production');

        expect(getEnvNameFromProcess({NODE_ENV: 'production'}))
            .toEqual('production');
    });


    it('fallback to development is missing', () => {
        expect(getEnvNameFromProcess({}))
            .toEqual('development')
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
