import { EichElement } from "../types";
import { col, EichColElement } from "./col";
import { container, EichContainerElement } from "./container";
import { eich } from "./eich";
import { EichRowElement, row } from "./row";
import { textContent } from "./text";

export type EichBaseElement = EichElement | EichColElement | EichRowElement | EichContainerElement

export const baseResolvers = [
  textContent,
  col,
  row,
  container,
  eich
]
