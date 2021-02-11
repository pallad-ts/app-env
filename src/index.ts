import {create} from "./create";
import {getEnvNameFromProcess} from "./getEnvNameFromProcess";

export * from './create';
export * from './Env';
export * from './Info';
export * from './getEnvNameFromProcess';

export const info = create(getEnvNameFromProcess());

export const isProduction = info.isProduction;
export const isDevelopment = info.isDevelopment;
export const isStaging = info.isStaging;
export const isTest = info.isTest;
export const env = info.name;
export const name = info.name;

export const is = info.is;
export const isEnv = info.isEnv;
export const forEnv = info.forEnv;
export const forOtherThan = info.forOtherThan;
export const forEnvOtherThan = info.forEnvOtherThan;
export const forEnvMap = info.forEnvMap;
export const forDevelopment = info.forDevelopment;
export const forOtherThanDevelopment = info.forOtherThanDevelopment;
export const forStaging = info.forStaging;
export const forOtherThanStaging = info.forOtherThanStaging;
export const forTest = info.forTest;
export const forOtherThanTest = info.forOtherThanTest;
export const forProduction = info.forProduction;
export const forOtherThanProduction = info.forOtherThanProduction;
export const build = info.build;
