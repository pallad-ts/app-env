import {Builder} from '@src/Builder';
import {create} from '@src/create';

describe('Builder', () => {
    const PRODUCTION = create('production');
    const DEVELOPMENT = create('development');
    const TEST = create('test');
    const STAGING = create('staging');

    const VALUE = 'foo';
    const VALUE_OTHER = 'bar';

    it('forNames', () => {
        expect(
            new Builder(PRODUCTION)
                .forEnv(['development', 'production'], VALUE)
                .get()
        ).toEqual(VALUE);
    });

    it('builder returns first matching result', () => {
        expect(
            new Builder(PRODUCTION)
                .forStaging(VALUE_OTHER)
                .forEnv(['production'], VALUE)
                .forProduction('what?')
                .get()
        ).toEqual(VALUE);
    })

    it('forProduction', () => {
        expect(
            new Builder(PRODUCTION)
                .forProduction(VALUE)
                .get()
        ).toEqual(VALUE);

        expect(
            new Builder(PRODUCTION)
                .forDevelopment(VALUE)
                .forStaging(VALUE)
                .forTest(VALUE)
                .default(VALUE_OTHER)
                .get()
        ).toEqual(VALUE_OTHER);
    });

    it('forDevelopment', () => {
        expect(
            new Builder(DEVELOPMENT)
                .forDevelopment(VALUE)
                .get()
        ).toEqual(VALUE);

        expect(
            new Builder(DEVELOPMENT)
                .forProduction(VALUE)
                .forStaging(VALUE)
                .forTest(VALUE)
                .default(VALUE_OTHER)
                .get()
        ).toEqual(VALUE_OTHER);
    });

    it('forStaging', () => {
        expect(
            new Builder(STAGING)
                .forStaging(VALUE)
                .get()
        ).toEqual(VALUE);

        expect(
            new Builder(STAGING)
                .forDevelopment(VALUE)
                .forProduction(VALUE)
                .forTest(VALUE)
                .default(VALUE_OTHER)
                .get()
        ).toEqual(VALUE_OTHER);
    });

    it('forTest', () => {
        expect(
            new Builder(TEST)
                .forTest(VALUE)
                .get()
        ).toEqual(VALUE);

        expect(
            new Builder(TEST)
                .forDevelopment(VALUE)
                .forProduction(VALUE)
                .forStaging(VALUE)
                .default(VALUE_OTHER)
                .get()
        ).toEqual(VALUE_OTHER);
    });
});

