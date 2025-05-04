import {assert, IsExact} from "conditional-type-checks";
import {Factory} from "../Factory";
import {AnyInfo, Info, InfoInferEnvNames} from "../Info";
import {Builder} from "../Builder";

describe('Factory', () => {

	const factory = new Factory({});

	describe('creating', () => {
		it('environment names are converted to lowercase', () => {
			const config = new Factory({
				envName: ['FOO', 'BAR'] as never,
			});
			expect(config.isValidEnvName('foo'))
				.toBe(true);
			expect(config.isValidEnvName('bar'))
				.toBe(true);
		});
	});


	describe('create', () => {
		const PRODUCTION = factory.create('production');
		const DEVELOPMENT = factory.create('development');
		const TEST = factory.create('test');
		const STAGING = factory.create('staging');
		const CI = factory.create('ci');
		const PREVIEW = factory.create('preview');

		it.each<[InfoInferEnvNames<ReturnType<typeof factory.create>>, { [key: string]: boolean }]>([
			['staging', {isStaging: true}],
			['test', {isTest: true}],
			['development', {isDevelopment: true}],
			['production', {isProduction: true}],
			['ci', {isCi: true}],
			['ci', {isCI: true}],
			['preview', {isPreview: true}],
		])('for env: %s', (env, expectedIsState) => {
			const info = factory.create(env);

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

		describe.each<[AnyInfo, AnyInfo]>([
			[PRODUCTION, DEVELOPMENT],
			[DEVELOPMENT, PRODUCTION],
			[TEST, DEVELOPMENT],
			[STAGING, DEVELOPMENT],
			[CI, DEVELOPMENT],
			[PREVIEW, DEVELOPMENT],
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
				.toEqual(new Builder(TEST));

			expect(PRODUCTION.build())
				.toEqual(new Builder(PRODUCTION));
		});
	});


	describe('getEnvNameFromProcess', () => {
		it('using default keys: APP_ENV, NODE_ENV', () => {
			expect(factory.getEnvNameFromProcess({APP_ENV: 'production'}))
				.toEqual('production');

			expect(factory.getEnvNameFromProcess({NODE_ENV: 'production'}))
				.toEqual('production');
		});

		describe('fallbacks', () => {
			it('to CI if APP_ENV, NODE_ENV are invalid as CI is detected', () => {
				expect(factory.getEnvNameFromProcess({
					APP_ENV: 'foo',
					NODE_ENV: 'bar',
					CI: 'true'
				}))
					.toEqual('ci');
			});

			it('to development if APP_ENV, NODE_ENV are invalid as CI is not detected', () => {
				expect(factory.getEnvNameFromProcess({
					APP_ENV: 'foo',
					NODE_ENV: 'bar',
				}))
					.toEqual('development');
			});

			it('to NODE_ENV if APP_ENV is not provided', () => {
				expect(
					factory.getEnvNameFromProcess({
						NODE_ENV: 'staging',
						CI: 'true',
					})
				)
					.toEqual('staging');
			});

			it('to CI if missing and CI is detected', () => {
				expect(factory.getEnvNameFromProcess({CI: 'true'}))
					.toEqual('ci')
			});

			it('to development if missing and not CI', () => {
				expect(factory.getEnvNameFromProcess({}))
					.toEqual('development')
			});

			it('to development if CI is detected but not supported', () => {
				const factory = new Factory({
					envName: ['test', 'development']
				});

				expect(factory.getEnvNameFromProcess({
					CI: 'true'
				}))
					.toEqual('development');
			});

			it('throws an error if none of provided env is valid and CI and development are not supported', () => {
				const factory = new Factory({
					envName: ['foo', 'bar']
				});

				expect(() => {
					factory.getEnvNameFromProcess({});
				}).toThrowErrorMatchingInlineSnapshot(`"No environment name found in config. Supported environment names: foo, bar. Environment variables considered: ["APP_ENV","NODE_ENV"]"`);
			});
		});

		describe('CI', () => {
			it('might be provided in APP_ENV', () => {
				expect(factory.getEnvNameFromProcess({APP_ENV: 'ci'}))
					.toEqual('ci');
			});

			it('might be provided in NODE_ENV', () => {
				expect(factory.getEnvNameFromProcess({NODE_ENV: 'ci'}))
					.toEqual('ci');
			});

			it.each([
				['CI'],
				['CONTINUOUS_INTEGRATION'],
				['BUILD_NUMBER'],
				['RUN_ID']
			])('to CI if ENV variable %s is present', envName => {
				expect(factory.getEnvNameFromProcess({[envName]: '1'}))
					.toEqual('ci');
			});
		});

		it('using provided keys', () => {
			const env = {
				APP_ENV: 'test',
				NODE_ENV: 'production'
			};

			const factory = new Factory({
				envNameEnvKeys: ['NODE_ENV']
			})
			expect(factory.getEnvNameFromProcess(env))
				.toEqual('production');
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
				expect(factory.getEnvNameFromProcess())
					.toEqual('staging');
			});
		})
	});

})
