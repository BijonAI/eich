import { CommonRecord } from "./utils";

export interface EichBasicNode<T extends string = string, P extends CommonRecord<any> = CommonRecord<any>> {
  tag: T;
  props: P;
  value?: string;
  children: EichBasicNode[];
}

export type EichTextNode = EichBasicNode<"#text">