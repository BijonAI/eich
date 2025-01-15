import { defineEvaluater, Widget } from "../types";
import { warn } from "../utils/logs";

export const forEvaluater = defineEvaluater<'for', { in: Iterable<any>, key: string }>(async ({ widget, context }) => {
  if (widget.tag !== 'for') return null
  const { in: iterable, key } = widget.attributes
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
      iterationContext,
      {
        children: []
      }
    )
    widget.children.forEach(child => child.compiled = false)
    if (resolvedChildren) {
      result.push(...resolvedChildren)
    }
  }
  widget.children.forEach(child => child.compiled = true)
  widget.compiled = true
  return result.flat()
})

export const conditionEvaluater = defineEvaluater<'if' | 'else' | 'elif', { condition: boolean }>(async ({ widget, context }) => {
  if (widget.tag !== 'if' && widget.tag !== 'else' && widget.tag !== 'elif') return null
  const { condition } = widget.attributes
  async function process() {
    return context.resolveChildren?.(widget.children.map(child => {
      child.compiled = false
      return child
    }), context, {
      children: []
    }) ?? []
  }
  if (widget.tag === 'if') {
    return condition ? await process() : []
  } else if (
    widget.tag === 'elif' &&
    widget.parent?.children.find(child => child.tag === 'if' && child.attributes.condition === false)
  ) {
    return condition ? await process() : []
  } else {
    return await process()
  }
})
