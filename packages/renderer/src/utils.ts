import { html } from "@rbardini/html";
import { computed, MaybeRef } from "@vue/reactivity";

export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;
export type CommonRecord<T> = Record<string, T>

export function reactiveHtml(strings: TemplateStringsArray, ...values: MaybeRef<any>[]) {
  return computed(() => {
    return html`${strings.map((string, index) => {
      return string + (values[index] ? values[index] : '')
    })}`
  })  
}
