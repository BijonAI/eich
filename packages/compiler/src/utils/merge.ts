import { MaybeArray, MaybePromise, Widget } from "../types";

export function mergeObjects(target: MaybePromise<MaybeArray<Widget> & Record<string, any> | null>, ...sources: MaybePromise<MaybeArray<Widget> & Record<string, any | null>>[]) {
  sources.forEach(source => {
    const descriptors = Object.getOwnPropertyDescriptors(source);
    Object.defineProperties(target, descriptors as PropertyDescriptorMap);
  });
  return target as Widget | Record<string, any>;
}
