import { builtins, defineComponent, effect, toValue, useAttrs } from "@eich/renderer"

export interface PagesAttributes {
  $width: string
  $height: string
}

const components = defineComponent<PagesAttributes>((attrs, children) => {
  const { width, height } = useAttrs(attrs, ['width', 'height'])
  const kids: HTMLElement[] = children() as HTMLElement[]
  const pages: HTMLElement[] = []
  const page: HTMLElement[] = []
  kids.forEach((kid, index) => {
    if (
      (kid.tagName === 'SLOT' && (kid as HTMLSlotElement).name === 'page-break')
      || index === kids.length - 1
    ) {
      const container = document.createElement('div')
      container.append(...page)
      pages.push(container)
      page.length = 0
    } else page.push(kid)
  })
  effect(() => {
    if (toValue(width)) pages.forEach(page => page.style.width = toValue(width)!)
    if (toValue(height)) pages.forEach(page => page.style.height = toValue(height)!)
  })
  return pages
})

builtins.set('pages', components)

export default components
