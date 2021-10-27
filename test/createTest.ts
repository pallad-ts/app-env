import {Env} from "@src/Env";
import {create} from "@src/create";
import {Info} from '@src/Info';
import {Builder} from '@src/Builder';

describe('create', () => {
	const PRODUCTION = create('production');
	const DEVELOPMENT = create('development');
	const TEST = create('test');
	const STAGING = create('staging');
	const CI = create('ci');

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

	const VALUE = 'FOO' as const;
	const VALUE_2 = 'BAR' as const;

	describe.each<[Info, Info]>([
		[PRODUCTION, DEVELOPMENT],
		[DEVELOPMENT, PRODUCTION],
		[TEST, DEVELOPMENT],
		[STAGING, DEVELOPMENT],
		[CI, DEVELOPMENT]
	])('forEnv returns value only for given environment', (env, oppositeEnv) => {

		it('uses provided value if matches env', () => {
			expect(env.forEnv(env.name)(VALUE)).toEqual(VALUE);
			expect(oppositeEnv.forEnv(env.name)(VALUE)).toBeUndefined();
		});

		it('uses fallback value if provided', () => {
			expect(env.forEnv(env.name)(VALUE, VALUE_2)).toEqual(VALUE);
			expect(oppositeEnv.forEnv(env.name)(VALUE, VALUE_2)).toEqual(VALUE_2);
		})
	});

	it('it builder creates builder for environment', () => {
		expect(TEST.build())
			.toEqual(Builder.create(TEST));

		expect(PRODUCTION.build())
			.toEqual(Builder.create(PRODUCTION));
	});
});
