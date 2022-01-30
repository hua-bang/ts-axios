import { isPlainObject } from './utils';

export function transformRequest(data: Record<string, any>): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
