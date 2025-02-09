import { P as PostMiddleware } from '../renderer-CivwDcFn.js';
import '@vue/reactivity';
import 'node:querystring';

interface FallthroughOptions {
    fallthrough: boolean;
}
declare const fallthrough: PostMiddleware;

export { type FallthroughOptions, fallthrough };
