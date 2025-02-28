import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface ImageAttributes {
  $src?: string
  $width?: string | number
  $height?: string | number
  $sizes?: string
  $srcset?: string
  alt?: string
  loading?: 'eager' | 'lazy'
  decoding?: 'sync' | 'async' | 'auto'
  crossorigin?: 'anonymous' | 'use-credentials'
  referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  usemap?: string
  ismap?: boolean
}

const component = defineComponent<ImageAttributes>((attrs, children) => {
  const props = useAttrs(attrs, [
    'src',
    'width',
    'height',
    'sizes',
    'srcset',
    'alt',
    'loading',
    'decoding',
    'crossorigin',
    'referrerpolicy',
    'usemap',
    'ismap',
  ])
  const element = document.createElement('img')

  effect(() => {
    if (props.src) {
      element.src = toValue(props.src)
    }
    if (props.width) {
      element.width = Number(toValue(props.width)) || 0
    }
    if (props.height) {
      element.height = Number(toValue(props.height)) || 0
    }
    if (props.sizes) {
      element.sizes = toValue(props.sizes)
    }
    if (props.srcset) {
      element.srcset = toValue(props.srcset)
    }
    if (props.alt) {
      element.alt = toValue(props.alt)
    }
    if (props.loading) {
      element.loading = toValue(props.loading) as 'eager' | 'lazy'
    }
    if (props.decoding) {
      element.decoding = toValue(props.decoding) as 'sync' | 'async' | 'auto'
    }
    if (props.crossorigin) {
      element.crossOrigin = toValue(props.crossorigin)
    }
    if (props.referrerpolicy) {
      element.referrerPolicy = toValue(props.referrerpolicy)
    }
    if (props.usemap) {
      element.useMap = toValue(props.usemap)
    }
    if (props.ismap) {
      element.isMap = Boolean(toValue(props.ismap))
    }

    element.append(...children())
  })

  return element
})

builtins.set('image', component)

export default component
