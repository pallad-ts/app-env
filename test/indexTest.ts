import * as lib from '@src/.';

describe('index', () => {
    for (const key of Object.keys(lib.info)) {
        it(`exports ${key}`, () => {
            const has = (lib as any)[key] === (lib as any).info[key];
            expect(has)
                .toBe(true);
        });
    }
});
