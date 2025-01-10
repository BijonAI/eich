import { warn } from "../utils/logs";
import { defineResolver, EichElement, VElement, WidgetContext } from "../types";

export interface EichForElement extends EichElement {
  attributes: {
    in: Iterable<any>
    key: string
  }
}

export const forResolver = defineResolver<EichForElement>(async ({ widget, context }) => {
  if (widget.tag !== 'for') return null
  const { in: iterable, key } = widget.attributes
  
  const result: VElement[] = []

  if (!key) {
    warn('You must specify a key for the for attribute')
    return null
  }

  const baseContext = {
    ...context,
    data: { ...context.data }
  }

  for (const item of iterable) {
    
    const iterationContext = {
      ...baseContext,
      data: {
        ...baseContext.data,
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

  return {
    widget: {
      tag: 'div',
      attributes: {
        style: 'display: flex; flex-direction: column; width: 100%;'
      },
      children: result.filter(child => child !== null && child !== undefined).slice(0, -1)
    },
    context: baseContext
  }
})
