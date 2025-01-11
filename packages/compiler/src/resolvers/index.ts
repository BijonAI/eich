import { EichElement } from "../types";
import { col, EichColElement } from "./col";
import { container, EichContainerElement } from "./container";
import { eich } from "./eich";
import { conditionResolver, forResolver } from "./functionality";
import { EichRowElement, row } from "./row";
import { textContent } from "./text";
import { valueResolver } from "./value";
import { varPresolver, varResolver } from "./var";

export type EichBaseElement = EichElement | EichColElement | EichRowElement | EichContainerElement

export const baseResolvers = [
  textContent,
  col,
  row,
  container,
  eich,
  conditionResolver,
  forResolver,
  varResolver,
  valueResolver,
]

export const basePresolvers = [
  varPresolver,
]
