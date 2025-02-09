import { C as Component } from '../renderer-CivwDcFn.js';
import '@vue/reactivity';
import 'node:querystring';

interface VarAttributes {
    $value: string;
    key: string;
}
declare const component: Component<VarAttributes, {}>;

export { type VarAttributes, component as default };
