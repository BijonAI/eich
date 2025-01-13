import { warn } from "../utils/logs";
import { defineEvaluater, EichElement, VElement } from "../types";
import { unref, MaybeRef } from "@vue/reactivity";

export interface EichForElement extends EichElement {
  attributes: {
    in: MaybeRef<Iterable<any>>
    key: string
  }
}

export interface EichConditionElement extends EichElement {
  tag: string,
  attributes: {
    condition: MaybeRef<boolean>
  }
}

export const forEvaluater = defineEvaluater<EichForElement>(async ({ widget, context }) => {
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

  for (const item of unref(iterable)) {
    
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
      children: result.slice(0, -1)
    },
    context: baseContext
  }
})

export const conditionEvaluater = defineEvaluater<EichConditionElement>(async ({ widget, context }) => {
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
