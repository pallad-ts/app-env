import {create} from "./create";
import {getEnvNameFromProcess} from "./getEnvNameFromProcess";

export * from './create';
export * from './Env';
export * from './Info';
export * from './getEnvNameFromProcess';

export const info = create(getEnvNameFromProcess());