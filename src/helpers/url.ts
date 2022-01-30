import { isDate, isObject } from './utils';

const ENCODE_MAP: Record<string, string> = {
  '%40': '@',
  '%3A': ':',
  '%24': '$',
  '%2C': ',',
  '%20': '+',
  '%5B': '[',
  '%5D': ']'
};

/**
 * 自定义的encode方法，ENCODE_MAP中的字符不进行encode
 * @param val string
 * @returns string
 */
function encode(val: string): string {
  return Object.keys(ENCODE_MAP).reduce((prev, curr) => {
    return prev.replace(new RegExp(curr, 'gi'), ENCODE_MAP[curr]);
  }, encodeURIComponent(val));
}

/**
 * 根据 url 和 params 拼接构造最终的url
 * @param url
 * @param params
 * @returns
 */
export function buildURL(url: string, params?: Record<string, any>): string {
  if (!params) {
    return url;
  }

  const parts: string[] = [];

  Object.keys(params).forEach(key => {
    const originalVal = params[key];
    if (originalVal === null || originalVal === undefined) {
      return;
    }
    let values: any[] = [];
    if (Array.isArray(originalVal)) {
      values = originalVal;
      key += '[]';
    } else {
      values = [originalVal];
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString();
      } else if (isObject(val)) {
        val = JSON.stringify(val);
      }
      parts.push(`${encode(key)}=${encode(val)}`);
    });
  });

  let serializedParams = parts.join('&');

  if (serializedParams) {
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}
