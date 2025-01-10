export function tip(content: string) {
  console.log('[Eich Compiler TIP] ', content)
}

export function error(content: string) {
  console.error('[Eich Compiler ERR] ', content)
}

export function warn(content: string) {
  console.warn('[Eich Compiler WARN] ', content)
}
