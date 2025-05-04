export class NoEnvironmentNameFoundError extends Error {
	override name = 'NoEnvironmentNameFoundError';

	static fromConfig(envKeyNameList: string[], supportedEnvNameList: string[]) {
		return new NoEnvironmentNameFoundError(
			`No environment name found in config. Supported environment names: ${supportedEnvNameList.join(', ')}. Environment variables considered: ${JSON.stringify(envKeyNameList)}`,
		);
	}
}
