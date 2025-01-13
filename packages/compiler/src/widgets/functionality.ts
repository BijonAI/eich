import { defineEvaluater, Widget } from "../types";
import { EichElement } from "../types";
import { warn } from "../utils/logs";

export interface EichForElement extends EichElement {
  attributes: {
    in: Iterable<any>
    key: string
  }
}

export interface EichConditionElement extends EichElement {
  tag: string,
  attributes: {
    condition: boolean
  }
}

export const forEvaluater = defineEvaluater<EichForElement>(async ({ widget, context }) => {
  if (widget.tag !== 'for') return null
  const { in: iterable, key } = widget.attributes

  console.log(iterable)

  if (!key) {
    warn('You must specify a key for the for attribute')
    return null
  }

  const result: Widget[] = []
  for (const item of iterable) {
    
    const iterationContext = {
      ...context,
      data: {
        ...context.data,
        [key]: item
      }
    }
    
    const resolvedChildren = await context.resolveChildren?.(
      widget.children,
      iterationContext
    )

    if (resolvedChildren) {
      result.push(...resolvedChildren)
    }
  }

  return result
})

export const conditionEvaluater = defineEvaluater<EichConditionElement>(async ({ widget, context }) => {
  if (widget.tag !== 'if' && widget.tag !== 'else' && widget.tag !== 'elif') return null
  const { condition } = widget.attributes
  const result: Widget[] = await context.resolveChildren?.(widget.children, context) ?? []
  if (widget.tag === 'if') {
    return condition ? result : null
  } else if (
    widget.tag === 'elif' &&
    widget.parent?.children.find(child => child.tag === 'if' && child.attributes.condition === false)
  ) {
    return condition ? result : null
  } else {
    return result
  }
})
