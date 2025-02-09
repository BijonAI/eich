import { Reactive } from '@vue/reactivity';

declare enum TextMode {
    DATA = 0,
    RCDATA = 1,
    RAWTEXT = 2,
    CDATA = 3
}
declare enum NodeType {
    TEXT = 0,
    ELEMENT = 1,
    CDATA = 2,
    COMMENT = 3,
    DOCUMENT = 4,
    RAW = 5,
    ATTRIBUTE = 6,
    VALUE = 7,
    FRAGMENT = 8,
    DIRECTIVE = 9
}
type ChildNode = ElementNode | TextNode | CDATANode | CommentNode | ValueNode | DocumentNode | FragmentNode | DirectiveNode;
interface BaseNode {
    type: NodeType;
    parent?: FragmentNode | DocumentNode | ElementNode;
}
interface ValueNode extends BaseNode {
    type: NodeType.VALUE;
    value: string;
}
interface DocumentNode extends BaseNode {
    type: NodeType.DOCUMENT;
    children: ChildNode[];
    filename: string;
    raw: string;
}
interface AttributeNode extends BaseNode {
    type: NodeType.ATTRIBUTE;
    name: string;
    value: string;
    raw: string;
}
interface ElementNode extends BaseNode {
    type: NodeType.ELEMENT;
    tag: string;
    selfClosing: boolean;
    attributes: AttributeNode[];
    children: ChildNode[];
}
interface DirectiveNode extends BaseNode {
    type: NodeType.DIRECTIVE;
    directive: string;
    attributes: AttributeNode[];
}
interface TextNode extends BaseNode {
    type: NodeType.TEXT;
    raw: string;
    content: string;
}
interface CDATANode extends BaseNode {
    type: NodeType.CDATA;
    content: string;
}
interface CommentNode extends BaseNode {
    type: NodeType.COMMENT;
    content: string;
}
interface FragmentNode extends BaseNode {
    type: NodeType.FRAGMENT;
    children: ChildNode[];
}
type ModeResolver = (tag: string) => TextMode;
interface ParseOptions {
    resolver?: ModeResolver;
    startPos?: number;
    initialMode?: TextMode;
    filename?: string;
}
declare function parse$1(source: string, { startPos, resolver, initialMode, filename }?: ParseOptions): DocumentNode;
declare function traverse<T>(traverser: (node: ChildNode, context: T) => false | void, node: ChildNode[] | ChildNode, context: T, maxDepth?: false | number): T;
declare function queryNode(filter: (node: ChildNode) => boolean, node: ChildNode[] | ChildNode, maxNum?: false | number, maxDepth?: false | number): Set<ChildNode>;

type EichSourceNode = EichIfNode | EichTextNode | EichBasicNode;
declare const kTextNode: unique symbol;
interface EichTextNode {
    tag: typeof kTextNode;
    value: string;
    raw: ChildNode;
}
interface EichIfNode {
    tag: 'if';
    attrs: Record<string, any>;
    children: EichSourceNode[];
    else?: EichElseNode;
    elif?: EichElifNode[];
    raw: ChildNode;
}
interface EichElifNode {
    tag: 'elif';
    attrs: Record<string, any>;
    children: EichSourceNode[];
    raw: ChildNode;
}
interface EichElseNode {
    tag: 'else';
    attrs: Record<string, any>;
    children: EichSourceNode[];
    raw: ChildNode;
}
interface EichBasicNode {
    tag: string;
    attrs: Record<string, any>;
    children: EichSourceNode[];
    raw: ChildNode;
}
type EichContext = Record<string, any>;
declare function toRoots(doc: DocumentNode): EichSourceNode[];

declare function parseSource(input: string, options?: Omit<ParseOptions, 'resolver'>): DocumentNode;
declare function parse(input: string): EichSourceNode[];
declare function isEichTextNode(node: EichSourceNode): node is EichTextNode;
declare function isEichIfNode(node: EichSourceNode): node is EichIfNode;
declare const textMode: Map<string, TextMode>;

declare const kCompOptions: unique symbol;
type Attributes = Record<string, any>;
type Context = Reactive<Record<string, any>>;
type ComponentOptions = Record<string, any>;
type Component<T extends Attributes = Attributes, O extends ComponentOptions = ComponentOptions> = ComponentFn<T> & {
    [kCompOptions]: Partial<O>;
};
type ComponentFn<T extends Attributes = Attributes> = (props: T, children: () => Node[], node: EichSourceNode) => Node | Node[] | void;
declare const builtins: Map<string, Component<any, ComponentOptions>>;
type PreMiddleware = (node: EichSourceNode, context: Context) => void;
type PostMiddleware = (node: EichSourceNode, context: Context, domNode: Node | Node[], comp: Component<any, any>) => void;
declare const middlewares: {
    readonly pre: Map<string, PreMiddleware>;
    readonly post: Map<string, PostMiddleware>;
};

declare function hasContext(): boolean;
declare function getCurrentContext(): Context;
declare function setCurrentContext(context: Context): void;
declare function mergeContext(target: Context, from: Context): Context;
declare function runInContext<T extends Context, R>(context: T, fn: () => R): R;
declare function createAdhoc<T = unknown>(src: string, context: Context): () => T;
declare function createAdhoc<T = unknown>(src: string): (context?: Context) => T;
declare function createAdhoc<T = unknown>(src: string, context?: Context): (context?: Context) => T;
declare function renderComp(comp: Component<any>, node: EichBasicNode): Node | Node[];
declare function renderNode(node: EichSourceNode): Node | Node[];
declare function renderRoots(roots: EichSourceNode[], target?: Node, initialContext?: Reactive<Context>): [Node[], Reactive<Context>];
declare function render(source: string, target?: Node, initialContext?: Reactive<Context>): [Node[], Reactive<Context>];
declare function getComponentOptions<T extends ComponentOptions>(o: Component<any, any>): Partial<T> | undefined;
declare function defineComponent<T extends Attributes = Attributes, O extends ComponentOptions = {}>(comp: ComponentFn<T>, options?: Partial<O>): Component<T, O>;

declare function defineMiddleware({ type, fn }: {
    type: 'pre';
    fn: PreMiddleware;
}): PreMiddleware;
declare function defineMiddleware({ type, fn }: {
    type: 'post';
    fn: PostMiddleware;
}): PostMiddleware;

export { type Attributes as A, type EichTextNode as B, type Component as C, type EichIfNode as D, type EichSourceNode as E, type EichElifNode as F, type EichElseNode as G, type EichBasicNode as H, type EichContext as I, parseSource as J, parse as K, isEichTextNode as L, isEichIfNode as M, NodeType as N, type PostMiddleware as P, TextMode as T, type Context as a, type ChildNode as b, type ComponentOptions as c, type ComponentFn as d, builtins as e, type PreMiddleware as f, getCurrentContext as g, hasContext as h, mergeContext as i, createAdhoc as j, renderComp as k, renderNode as l, middlewares as m, renderRoots as n, render as o, parse$1 as p, queryNode as q, runInContext as r, setCurrentContext as s, traverse as t, getComponentOptions as u, defineComponent as v, defineMiddleware as w, textMode as x, toRoots as y, kTextNode as z };
