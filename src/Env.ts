export type Env<T extends string> = Lowercase<T> | Env.Name;

export namespace Env {
	export type Name = typeof List[number]
	export const List = ['development', 'test', 'production', 'staging', 'ci', 'preview'] as const;

	export enum Enum {
		DEVELOPMENT = 'development',
		TEST = 'test',
		PRODUCTION = 'production',
		STAGING = 'staging',
		CI = 'ci',
		PREVIEW = 'preview'
	}
}
