import { isPlainObject, deepMerge } from '../helpers/utils';
import { AxiosRequestConfig } from '../types';

const stratMap = Object.create(null);

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1;
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2;
  }
}

function deepMergeStart(val1: any, val2: any) {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2);
  } else if (typeof val2 !== 'undefined') {
    return val2;
  } else if (isPlainObject(val1)) {
    return deepMerge(val1);
  } else if (typeof val1 !== 'undefined') {
    return val1;
  }
}

const stratKeysDeepMerge = ['headers'];

stratKeysDeepMerge.forEach(key => {
  stratMap[key] = deepMergeStart;
});

const stratKeysFromVal2 = ['url', 'params', 'data'];

stratKeysFromVal2.forEach(key => {
  stratMap[key] = fromVal2Strat;
});

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: Partial<AxiosRequestConfig>
): AxiosRequestConfig {
  if (!config2) {
    config2 = {} as Partial<AxiosRequestConfig>;
  }

  const config = Object.create(null);

  function mergeField(key: string): void {
    const strat = stratMap[key] || defaultStrat;
    config[key] = strat(config1[key], config2![key]);
  }

  for (let key in config2) {
    mergeField(key);
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key);
    }
  }

  return config;
}
