export function wrap(node: Node) {
  return {
    node() {
      return node as SVGElement
    },
  }
}
