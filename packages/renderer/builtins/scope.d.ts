import { C as Component } from '../renderer-CivwDcFn.js';
import '@vue/reactivity';
import 'node:querystring';

interface ScopeAttributes {
    detached?: boolean;
}
declare const component: Component<ScopeAttributes, {}>;

export { type ScopeAttributes, component as default };
