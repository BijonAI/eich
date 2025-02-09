import { ComputedRef, MaybeRefOrGetter } from '@vue/reactivity';
export * from '@vue/reactivity';
import { A as Attributes, a as Context, b as ChildNode } from './renderer-CivwDcFn.js';
export { C as Component, d as ComponentFn, c as ComponentOptions, H as EichBasicNode, I as EichContext, F as EichElifNode, G as EichElseNode, D as EichIfNode, E as EichSourceNode, B as EichTextNode, N as NodeType, P as PostMiddleware, f as PreMiddleware, T as TextMode, e as builtins, j as createAdhoc, v as defineComponent, w as defineMiddleware, u as getComponentOptions, g as getCurrentContext, h as hasContext, M as isEichIfNode, L as isEichTextNode, z as kTextNode, i as mergeContext, m as middlewares, K as parse, y as parseFromRaw, p as parseRaw, J as parseSource, q as queryNode, o as render, k as renderComp, l as renderNode, n as renderRoots, r as runInContext, s as setCurrentContext, x as textMode, t as traverse } from './renderer-CivwDcFn.js';
import { ClassValue } from 'clsx';
export { default as patch } from 'morphdom';
import 'node:querystring';

declare function useAttrs<const K extends string>(attrs: Attributes, keys: K[], context?: Context): {
    [P in K]?: ComputedRef<string> | string;
};
declare function useAttrValues<const T extends [unknown] | unknown = string[]>(attrs: Attributes, keys: string[], context?: Context): {
    [P in keyof T]?: ComputedRef<T[P]> | T[P];
};
declare function useAttr<const T = string>(attrs: Attributes, key: string, context?: Context): ComputedRef<T> | T | undefined;

declare function _setRxAttr(el: Element, name: string, value: unknown): void;
type InterpolateParam = MaybeRefOrGetter<ClassValue> | Node | (MaybeRefOrGetter<ClassValue> | Node)[] | EventListenerOrEventListenerObject;
type Template<T extends (string | number)> = (values: Record<T, InterpolateParam>, rawAttrs?: boolean) => Node;
declare function template<const T extends (string | number)>(literal: TemplateStringsArray, ...keys: T[]): Template<T>;
declare function html(literal: TemplateStringsArray, ...values: InterpolateParam[]): Node;

declare function querySelector(root: ChildNode | ChildNode[], selector: string): ChildNode | null;
declare function querySelectorAll(root: ChildNode | ChildNode[], selector: string): Set<ChildNode>;

declare const noop: () => void;
declare function style(source: TemplateStringsArray, ...values: MaybeRefOrGetter<unknown>[]): () => void;
declare function useBlockScope<T>(fn: () => T, detached?: boolean, base?: object): T;
declare function eich(literal: TemplateStringsArray, ...values: MaybeRefOrGetter<unknown>[]): Node[];
declare function createDelegate(map: Record<string, any>, eventNames?: string[], adhoc?: boolean): (node: Node) => void;

export { Attributes, Context, type InterpolateParam, type Template, _setRxAttr, createDelegate, eich, html, noop, querySelector, querySelectorAll, style, template, useAttr, useAttrValues, useAttrs, useBlockScope };
