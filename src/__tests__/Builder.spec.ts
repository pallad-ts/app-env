import {assert, IsExact} from 'conditional-type-checks';
import {factory} from "../setup";
import {Builder} from "../Builder";
import {AnyInfo} from "../Info";

describe('Builder', () => {
	const PRODUCTION = factory.create('production');
	const DEVELOPMENT = factory.create('development');
	const TEST = factory.create('test');
	const CI = factory.create('ci');
	const STAGING = factory.create('staging');
	const PREVIEW = factory.create('preview');

	const VALUE = 'foo' as const;
	const VALUE_OTHER = 'bar' as const;

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

	it('default returned if none matches', () => {
		expect(
			new Builder(PRODUCTION)
				.forStaging(VALUE)
				.forTest(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);

		expect(
			new Builder(PRODUCTION)
				.forStaging(VALUE)
				.forTest(VALUE)
				.forProduction(VALUE)
				.getOrDefault(VALUE_OTHER)
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
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
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
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
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
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
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
				.forPreview(VALUE)
				.forCI(VALUE)
				.getOrDefault(VALUE_OTHER)
		).toEqual(VALUE_OTHER);
	});

	it('forCI', () => {
		expect(
			new Builder(CI)
				.forCI(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			new Builder(CI)
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
			new Builder(PREVIEW)
				.forPreview(VALUE)
				.get()
		).toEqual(VALUE);

		expect(
			new Builder(PREVIEW)
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
			const value = new Builder({} as AnyInfo)
				.forTest('bar' as const)
				.forProduction('foo' as const)
				.get();

			assert<IsExact<typeof value, 'foo' | 'bar' | undefined>>(true);
		});

		it('providing default removed possibility of undefined', () => {
			const value = new Builder({} as AnyInfo)
				.forTest('bar' as const)
				.forProduction('foo' as const)
				.getOrDefault('what?' as const)

			assert<IsExact<typeof value, 'foo' | 'bar' | 'what?'>>(true);
		});
	});
});

