import {Configuration} from "@src/Configuration";
import {Env} from "@src/Env";
import {Info} from "@src/Info";
import {Builder} from "@src/Builder";
import {assert, IsExact} from "conditional-type-checks";

describe('Configuration', () => {

	const configuration = new Configuration([]);

	describe('creating', () => {
		const extraEnvs = ['test_1', 'test_2'] as const;
		const configuration = new Configuration(extraEnvs);

		it('by default contains all standard environments', () => {
			for (const envName of Env.List) {
				expect(configuration.isEnvironmentNameAvailable(envName))
					.toBe(true);
			}

			expect(configuration.isEnvironmentNameAvailable('test_1')).toBe(true);
			expect(configuration.isEnvironmentNameAvailable('test_2')).toBe(true);
		});

		it('allows to retrieve non standard environment names', () => {
			expect(configuration.getNonStandardEnvironmentNames())
				.toEqual(extraEnvs);
		});

		it('environment names are converted to lowercase', () => {
			const config = new Configuration(['FOO', 'BAR']);
			expect(config.isEnvironmentNameAvailable('foo'))
				.toBe(true);
			expect(config.isEnvironmentNameAvailable('bar'))
				.toBe(true);

			type EnvironmentName = ReturnType<typeof config.getNonStandardEnvironmentNames>[number];
			assert<IsExact<EnvironmentName, Env<'foo' | 'bar'>>>(true);
		});
	});


	describe('create', () => {
		const PRODUCTION = configuration.create('production');
		const DEVELOPMENT = configuration.create('development');
		const TEST = configuration.create('test');
		const STAGING = configuration.create('staging');
		const CI = configuration.create('ci');

		it.each<[Env<string>, { [key: string]: boolean }]>([
			['staging', {isStaging: true}],
			['test', {isTest: true}],
			['development', {isDevelopment: true}],
			['production', {isProduction: true}]
		])('for env: %s', (env, expectedIsState) => {
			const info = configuration.create(env);

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

		describe.each<[Info<Env<string>>, Info<Env<string>>]>([
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


	describe('getEnvNameFromProcess', () => {
		it('using default keys: APP_ENV, NODE_ENV', () => {
			expect(configuration.getEnvNameFromProcess({APP_ENV: 'production'}))
				.toEqual('production');

			expect(configuration.getEnvNameFromProcess({NODE_ENV: 'production'}))
				.toEqual('production');
		});

		describe('fallbacks', () => {
			it('to CI if APP_ENV, NODE_ENV are invalid as CI is detected', () => {
				expect(configuration.getEnvNameFromProcess({
					APP_ENV: 'foo',
					NODE_ENV: 'bar',
					CI: 'true'
				}))
					.toEqual('ci');
			});

			it('to development if APP_ENV, NODE_ENV are invalid as CI is not detected', () => {
				expect(configuration.getEnvNameFromProcess({
					APP_ENV: 'foo',
					NODE_ENV: 'bar',
				}))
					.toEqual('development');
			});

			it('to NODE_ENV if APP_ENV is not provided', () => {
				expect(
					configuration.getEnvNameFromProcess({
						NODE_ENV: 'staging',
						CI: 'true',
					})
				)
					.toEqual('staging');
			});

			it('to CI if missing and CI is detected', () => {
				expect(configuration.getEnvNameFromProcess({CI: 'true'}))
					.toEqual('ci')
			});

			it('to development if missing and not CI', () => {
				expect(configuration.getEnvNameFromProcess({}))
					.toEqual('development')
			});
		});

		describe('CI', () => {
			it('might be provided in APP_ENV', () => {
				expect(configuration.getEnvNameFromProcess({APP_ENV: 'ci'}))
					.toEqual('ci');
			});

			it('might be provided in NODE_ENV', () => {
				expect(configuration.getEnvNameFromProcess({NODE_ENV: 'ci'}))
					.toEqual('ci');
			});

			it.each([
				['CI'],
				['CONTINUOUS_INTEGRATION'],
				['BUILD_NUMBER'],
				['RUN_ID']
			])('to CI if ENV variable %s is present', envName => {
				expect(configuration.getEnvNameFromProcess({[envName]: '1'}))
					.toEqual('ci');
			});
		});

		it('using provided keys', () => {
			const env = {
				APP_ENV: 'test',
				NODE_ENV: 'production'
			};

			expect(configuration.getEnvNameFromProcess(env, ['NODE_ENV']))
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
				expect(configuration.getEnvNameFromProcess())
					.toEqual('staging');
			});
		})
	});

})
