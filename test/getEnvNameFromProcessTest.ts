import {getEnvNameFromProcess} from "@src/getEnvNameFromProcess";

describe('getEnvNameFromProcess', () => {
	it('using default keys: APP_ENV, NODE_ENV', () => {
		expect(getEnvNameFromProcess({APP_ENV: 'production'}))
			.toEqual('production');

		expect(getEnvNameFromProcess({NODE_ENV: 'production'}))
			.toEqual('production');
	});

	describe('fallbacks', () => {
		it('to CI if APP_ENV, NODE_ENV are invalid as CI is detected', () => {
			expect(getEnvNameFromProcess({
				APP_ENV: 'foo',
				NODE_ENV: 'bar',
				CI: 'true'
			}))
				.toEqual('ci');
		});

		it('to development if APP_ENV, NODE_ENV are invalid as CI is not detected', () => {
			expect(getEnvNameFromProcess({
				APP_ENV: 'foo',
				NODE_ENV: 'bar',
			}))
				.toEqual('development');
		});

		it('to NODE_ENV if APP_ENV is not provided', () => {
			expect(
				getEnvNameFromProcess({
					NODE_ENV: 'staging',
					CI: 'true',
				})
			)
				.toEqual('staging');
		});

		it('to CI if missing and CI is detected', () => {
			expect(getEnvNameFromProcess({CI: 'true'}))
				.toEqual('ci')
		});

		it('to development if missing and not CI', () => {
			expect(getEnvNameFromProcess({}))
				.toEqual('development')
		});
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
