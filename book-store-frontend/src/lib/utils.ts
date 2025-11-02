import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { camelCase, snakeCase, isArray, isObject } from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function keysToCamel(obj: any): Record<string, any> {
  if (isArray(obj)) return obj.map((v) => keysToCamel(v));
  if (isObject(obj)) {
    return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
      acc[camelCase(key)] = keysToCamel((obj as Record<string, any>)[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function keysToSnake(obj: any): any {
  if (isArray(obj)) return obj.map((v) => keysToSnake(v));
  if (isObject(obj)) {
    return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
      acc[snakeCase(key)] = keysToSnake((obj as Record<string, any>)[key]);
      return acc;
    }, {});
  }
  return obj;
}

