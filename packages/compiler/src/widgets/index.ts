import { defineEvaluater, EichElement } from "../types";
import { col, EichColElement } from "./col";
import { container, EichContainerElement } from "./container";
import { eich } from "./eich";
import { conditionEvaluater, forEvaluater } from "./functionality";
import { EichRowElement, row } from "./row";
import { textContent } from "./text";
import { valueEvaluater } from "./value";
import { varEvaluater, varResolver } from "./var";

export type EichBaseElement = EichElement | EichColElement | EichRowElement | EichContainerElement

export const baseEvaluaters = [
  varEvaluater,
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
]
