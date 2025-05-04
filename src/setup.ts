import {Factory} from "./Factory";
import {InfoInferEnvNames} from "./Info";

export const factory = new Factory({});

export const info = factory.createFromProcessEnv();

export const isProduction = info.isProduction;
export const isDevelopment = info.isDevelopment;
export const isStaging = info.isStaging;
export const isTest = info.isTest;
export const isPreview = info.isPreview;
export const isCI = info.isCI;
export const isCi = info.isCi;

export const env = info.name;
export const name = info.name;
export const id = info.id;
export const is = info.is;
export const isEnv = info.isEnv;
export const isEnvId = info.isEnvId;
export const forEnv = info.forEnv;
export const forCI = info.forCI;
export const forCi = info.forCi;
export const forDevelopment = info.forDevelopment;
export const forStaging = info.forStaging;
export const forTest = info.forTest;
export const forProduction = info.forProduction;
export const forPreview = info.forPreview;
export const build = info.build;

export type Env = InfoInferEnvNames<typeof info>;
