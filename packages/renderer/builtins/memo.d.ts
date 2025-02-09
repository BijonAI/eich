import { C as Component } from '../renderer-CivwDcFn.js';
import '@vue/reactivity';
import 'node:querystring';

interface MemoAttributes {
    $value: string;
    key: string;
}
declare const component: Component<MemoAttributes, {}>;

export { type MemoAttributes, component as default };
