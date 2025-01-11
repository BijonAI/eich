import { warn } from "../utils/logs";
import { defineResolver, EichElement, VElement, WidgetContext } from "../types";

export interface EichForElement extends EichElement {
  attributes: {
    in: Iterable<any>
    key: string
  }
}

export interface EichConditionElement extends EichElement {
  tag: 'if' | 'else' | 'elif',
  attributes: {
    condition: boolean
  }
}

export const forResolver = defineResolver<EichForElement>(async ({ widget, context }) => {
  if (widget.tag !== 'for') return null
  const { in: iterable, key } = widget.attributes
  console.log(iterable)
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

  widget.parent?.children.push({
    tag: 'text-content',
    attributes: {
      content: 'test'
    },
    children: []
  })

  return {
    widget: {
      tag: 'div',
      attributes: {
        style: 'display: flex; flex-direction: column; width: 100%;'
      },
      children: result.filter(child => child !== null && child !== undefined && child.tag).slice(0, -1)
    },
    context: baseContext
  }
})

export const conditionResolver = defineResolver<EichConditionElement>(async ({ widget, context }) => {
  if (widget.tag !== 'if' && widget.tag !== 'else' && widget.tag !== 'elif') return null
  const { condition } = widget.attributes
  if (widget.tag === 'if') {
    return condition ? {
      widget: {
        tag: 'div',
        attributes: {
          style: 'display: flex; width: 100%; height: 100%;'
        },
        children: []
      },
      context
    } : null
  } else if (widget.parent?.children.find(child => child.tag === 'if' && child.attributes.condition === false) && widget.tag === 'elif') {
    return condition ? {
      widget: {
        tag: 'div',
        attributes: {
          style: 'display: flex; width: 100%; height: 100%;'
        },
        children: []
      },
      context
    } : null
  } else {
    return condition ? {
      widget: {
        tag: 'div',
        attributes: {
          style: 'display: flex; width: 100%; height: 100%;'
        },
        children: []
      },
      context
    } : null
  }
})
