import { defineEvaluater, EichElement } from "../types";
import { col } from "./col";
import { container } from "./container";
import { eich } from "./eich";
import { conditionEvaluater, forEvaluater } from "./functionality";
import { row } from "./row";
import { textContent } from "./text";
import { valueEvaluater } from "./value";
import { varEvaluater, varResolver } from "./var";

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
