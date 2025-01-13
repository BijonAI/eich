import { EichElement } from "../types";
import { col, EichColElement } from "./col";
import { container, EichContainerElement } from "./container";
import { eich } from "./eich";
import { conditionEvaluater, forEvaluater } from "./functionality";
import { refResolver } from "./ref";
import { EichRowElement, row } from "./row";
import { textContent } from "./text";
import { valueEvaluater } from "./value";
import { varResolver } from "./var";

export type EichBaseElement = EichElement | EichColElement | EichRowElement | EichContainerElement

export const baseEvaluaters = [
  textContent,
  col,
  row,
  container,
  eich,
  conditionEvaluater,
  forEvaluater,
  valueEvaluater,
]

export const baseResolvers = [
  varResolver,
  refResolver,
]
