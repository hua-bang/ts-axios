import { isObject, isPlainObject } from "./utils";

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

export function transformResponse(data: string) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (err) {
      // something
    }
  }
  return data;
}