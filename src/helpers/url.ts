import { isDate, isPlainObject } from "./utils";

const ENCODE_MAP: {[key: string]: string} = {
  "%40": "@",
  "%3A": ':',
  "%24": "$",
  "%2C": ",",
  "%20": "+",
  "%5B": "[",
  "%5D": "]"
};

function encode(val: string): string {
  return Object.keys(ENCODE_MAP)
    .reduce((prev, curr) => {
      return prev.replace(new RegExp(curr, "gi"), ENCODE_MAP[curr])
    }, encodeURIComponent(val));

  return encodeURIComponent(val).replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

function serialize(params?: any): string {
  const parts: string[] = [];
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val === null || val === "undefined") {
      return;
    }

    let values = [];

    if (Array.isArray(val)) {
      key += "[]";
      values = val;
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString();
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val);
      }
      parts.push(`${encode(key)}=${encode(val)}`);
    })
  });
  return parts.join("&");
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url;
  }

  let serializeParams = serialize(params);
  if (serializeParams) {
    const markIndex = url.indexOf("#");
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializeParams;
  }
  return url;
}