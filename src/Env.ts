import {ElementOf} from 'ts-essentials';

export type Env = ElementOf<typeof Env.List>;

export namespace Env {
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
