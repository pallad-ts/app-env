import {Builder} from '@src/Builder';
import {assert, IsExact} from 'conditional-type-checks';
import {configuration} from "@src/setup";

describe('Builder', () => {
	const PRODUCTION = configuration.create('production');
	const DEVELOPMENT = configuration.create('development');
	const TEST = configuration.create('test');
	const CI = configuration.create('ci');
	const STAGING = configuration.create('staging');
	const PREVIEW = configuration.create('preview');

	const VALUE = 'foo' as const;
	const VALUE_OTHER = 'bar' as const;

	it('forNames', () => {
		expect(
			Builder.create(PRODUCTION)
				.forEnv(['development', 'production'], VALUE)
				.get()
		).toEqual(VALUE);
	});

	it('builder returns first matching result', () => {
		expect(
			Builder.create(PRODUCTION)
				.forStaging(VALUE_OTHER)
				.forEnv(['production'], VALUE)
				.forProduction('what?')
				.get()
		).toEqual(VALUE);
	})

	it('default returned if none matches', () => {
		expect(
			Builder.create(PRODUCTION)
				.forStaging(VALUE)
				.forTest(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);

		expect(
			Builder.create(PRODUCTION)
				.forStaging(VALUE)
				.forTest(VALUE)
				.forProduction(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE);
	})

	it('forProduction', () => {
		expect(
			Builder.create(PRODUCTION)
				.forProduction(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			Builder.create(PRODUCTION)
				.forDevelopment(VALUE)
				.forStaging(VALUE)
				.forTest(VALUE)
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	it('forDevelopment', () => {
		expect(
			Builder.create(DEVELOPMENT)
				.forDevelopment(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			Builder.create(DEVELOPMENT)
				.forProduction(VALUE)
				.forStaging(VALUE)
				.forTest(VALUE)
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	it('forStaging', () => {
		expect(
			Builder.create(STAGING)
				.forStaging(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			Builder.create(STAGING)
				.forDevelopment(VALUE)
				.forProduction(VALUE)
				.forTest(VALUE)
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	it('forTest', () => {
		expect(
			Builder.create(TEST)
				.forTest(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			Builder.create(TEST)
				.forDevelopment(VALUE)
				.forProduction(VALUE)
				.forStaging(VALUE)
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	it('forCI', () => {
		expect(
			Builder.create(CI)
				.forCI(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			Builder.create(CI)
				.forDevelopment(VALUE)
				.forProduction(VALUE)
				.forStaging(VALUE)
				.forPreview(VALUE)
				.forTest(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	it('forPreview', () => {
		expect(
			Builder.create(PREVIEW)
				.forPreview(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			Builder.create(PREVIEW)
				.forDevelopment(VALUE)
				.forProduction(VALUE)
				.forStaging(VALUE)
				.forTest(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	describe('types', () => {
		it('simple type inference', () => {
			const value = Builder.create({} as any)
				.forTest('bar' as const)
				.forProduction('foo' as const)
				.get();

			assert<IsExact<typeof value, 'foo' | 'bar' | undefined>>(true);
		});

		it('providing default removed possibility of undefined', () => {
			const value = Builder.create({} as any)
				.forTest('bar' as const)
				.forProduction('foo' as const)
				.getOrDefault('what?' as const)

			assert<IsExact<typeof value, 'foo' | 'bar' | 'what?'>>(true);
		});
	});
});

