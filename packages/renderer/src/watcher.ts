export type MutationCallbacks = {
  mounted?: (node: Node) => void
  unmounted?: (node: Node) => void
}

const callbacks = new WeakMap<Node, MutationCallbacks>()


const observer = new MutationObserver((m) => {
  m.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (callbacks.has(node)) {
          callbacks.get(node)!.mounted?.(node)
        }
      })

      mutation.removedNodes.forEach((node) => {
        if (callbacks.has(node)) {
          callbacks.get(node)!.unmounted?.(node)
        }
      })
    }
  })
})

export function setMutationCallback(node: Node | Node[], cbs: MutationCallbacks | undefined): void {
  if (Array.isArray(node)) {
    node.forEach((n) => setMutationCallback(n, cbs))
  }
  else {
    if (cbs) { 
      callbacks.set(node, cbs)
    } else {
      callbacks.delete(node)
    }
  }
}

observer.observe(document.body, { childList: true, subtree: true })