import { computed, MaybeRef, isRef, Ref, ref } from "@vue/reactivity";

export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;
export type MaybeNull<T> = T | null;
export type CommonRecord<T> = Record<string, T>;

export function isRefArray(value: MaybeRef<any>[]) {
  if (!Array.isArray(value)) return false
  return value.every(item => isRef(item))
}

export function reactiveHtml(strings: TemplateStringsArray, ...values: MaybeRef<any>[]) {
  return computed(() => strings.map((string, index) => {
    if (isRefArray(values[index])) return string + (values[index].map((item: Ref<any>) => item.value).join('') ?? '')
    if (isRef(values[index])) return string + (values[index].value ?? '')
    return string + (values[index] ?? '')
  }).join(''))
}

