import { C as Component } from '../renderer-CivwDcFn.js';
import '@vue/reactivity';
import 'node:querystring';

interface ForAttributes {
    $in: string;
    key: string;
    as?: string;
}
declare const component: Component<ForAttributes, {}>;

export { type ForAttributes, component as default };
