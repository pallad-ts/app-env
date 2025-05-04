export type StandardEnvName = typeof StandardEnvNameList[number];

export const StandardEnvNameList = ['production', 'staging', 'development', 'ci', 'test', 'preview'] as const;
