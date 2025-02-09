import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TextAttributes {
  '$font'?: string | string[]
  '$fallback'?: boolean
  '$style'?: string
  '$weight'?: number | string
  '$stretch'?: number
  '$size'?: string | number
  '$fill'?: string
  '$stroke'?: string | null | {
    width?: string | number
    color?: string
    pattern?: string
  }
  '$tracking'?: string | number
  '$spacing'?: number
  '$cjk-latin-spacing'?: 'none' | 'auto'
  '$baseline'?: string | number
  '$overhang'?: boolean
  '$top-edge'?: string | number
  '$bottom-edge'?: string | number
  '$lang'?: string
  '$region'?: string | null
  '$script'?: string | 'auto'
  '$dir'?: 'auto' | 'ltr' | 'rtl'
  '$hyphenate'?: boolean | 'auto'
  '$costs'?: Record<string, any>
  '$kerning'?: boolean
  '$alternates'?: boolean
  '$stylistic-set'?: number[] | null
  '$ligatures'?: boolean
  '$discretionary-ligatures'?: boolean
  '$historical-ligatures'?: boolean
  '$number-type'?: string | 'auto'
  '$number-width'?: string | 'auto'
  '$slashed-zero'?: boolean
  '$fractions'?: boolean
  '$features'?: Array<Record<string, any>> | Record<string, any>
}

export const component = defineComponent<TextAttributes>((props, children) => {
  const {
    font,
    fallback,
    style,
    weight,
    stretch,
    size,
    fill,
    stroke,
    tracking,
    spacing,
    'cjk-latin-spacing': cjkLatinSpacing,
    baseline,
    overhang,
    'top-edge': topEdge,
    'bottom-edge': bottomEdge,
    lang,
    region,
    script,
    dir,
    hyphenate,
    costs,
    kerning,
    alternates,
    'stylistic-set': stylisticSet,
    ligatures,
    'discretionary-ligatures': discretionaryLigatures,
    'historical-ligatures': historicalLigatures,
    'number-type': numberType,
    'number-width': numberWidth,
    'slashed-zero': slashedZero,
    fractions,
    features,
  } = useAttrs(props, [
    'font',
    'fallback',
    'style',
    'weight',
    'stretch',
    'size',
    'fill',
    'stroke',
    'tracking',
    'spacing',
    'cjk-latin-spacing',
    'baseline',
    'overhang',
    'top-edge',
    'bottom-edge',
    'lang',
    'region',
    'script',
    'dir',
    'hyphenate',
    'costs',
    'kerning',
    'alternates',
    'stylistic-set',
    'ligatures',
    'discretionary-ligatures',
    'historical-ligatures',
    'number-type',
    'number-width',
    'slashed-zero',
    'fractions',
    'features',
  ]) as {
    'font'?: string | string[]
    'fallback'?: boolean
    'style'?: string
    'weight'?: number | string
    'stretch'?: number
    'size'?: string | number
    'fill'?: string
    'stroke'?: string | null | {
      width?: string | number
      color?: string
      pattern?: string
    }
    'tracking'?: string | number
    'spacing'?: number
    'cjk-latin-spacing'?: 'none' | 'auto'
    'baseline'?: string | number
    'overhang'?: boolean
    'top-edge'?: string | number
    'bottom-edge'?: string | number
    'lang'?: string
    'region'?: string | null
    'script'?: string | 'auto'
    'dir'?: 'auto' | 'ltr' | 'rtl'
    'hyphenate'?: boolean | 'auto'
    'costs'?: Record<string, any>
    'kerning'?: boolean
    'alternates'?: boolean
    'stylistic-set'?: number[] | null
    'ligatures'?: boolean
    'discretionary-ligatures'?: boolean
    'historical-ligatures'?: boolean
    'number-type'?: string | 'auto'
    'number-width'?: string | 'auto'
    'slashed-zero'?: boolean
    'fractions'?: boolean
    'features'?: Array<Record<string, any>> | Record<string, any>
  }

  const span = document.createElement('span')

  effect(() => {
    const fontValue = toValue(font)
    const fallbackValue = toValue(fallback)

    if (Array.isArray(fontValue)) {
      const fonts = fontValue.map(f => f.includes(' ') ? `"${f}"` : f)
      if (fallbackValue !== false) {
        fonts.push('system-ui', 'sans-serif')
      }
      span.style.fontFamily = fonts.join(',')
    }
    else if (fontValue) {
      const fonts = [fontValue.includes(' ') ? `"${fontValue}"` : fontValue]
      if (fallbackValue !== false) {
        fonts.push('system-ui', 'sans-serif')
      }
      span.style.fontFamily = fonts.join(',')
    }

    span.style.fontStyle = toValue(style) ?? 'normal'
    span.style.fontWeight = String(toValue(weight) ?? 400)
    span.style.fontStretch = String(toValue(stretch) ?? 100)
    span.style.fontSize = String(toValue(size) ?? '16px')

    span.style.color = toValue(fill) ?? '#000'

    const strokeVal = toValue(stroke)
    if (strokeVal) {
      if (typeof strokeVal === 'string') {
        span.style.webkitTextStroke = `1px ${strokeVal}`
      }
      else if (typeof strokeVal === 'object' && strokeVal !== null) {
        const width = 'width' in strokeVal ? strokeVal.width : '1px'
        const color = 'color' in strokeVal ? strokeVal.color : '#000'
        span.style.webkitTextStroke = `${width} ${color}`
      }
    }

    span.style.letterSpacing = String(toValue(tracking) ?? 'normal')
    span.style.wordSpacing = String(toValue(spacing) ?? 'normal')
    span.lang = toValue(lang) ?? 'en'
    span.dir = toValue(dir) ?? 'auto'

    if (toValue(hyphenate) !== false) {
      span.style.hyphens = 'auto'
    }
    else {
      span.style.hyphens = 'none'
    }

    if (toValue(kerning) !== false) {
      span.style.fontKerning = 'normal'
    }
    else {
      span.style.fontKerning = 'none'
    }

    const featureSettings: string[] = []

    if (toValue(ligatures) !== false)
      featureSettings.push('"liga" 1')
    if (toValue(discretionaryLigatures))
      featureSettings.push('"dlig" 1')
    if (toValue(historicalLigatures))
      featureSettings.push('"hlig" 1')
    if (toValue(alternates))
      featureSettings.push('"salt" 1')
    if (toValue(fractions))
      featureSettings.push('"frac" 1')
    if (toValue(slashedZero))
      featureSettings.push('"zero" 1')

    const stylisticSetVal = toValue(stylisticSet)
    if (Array.isArray(stylisticSetVal)) {
      stylisticSetVal.forEach((set) => {
        featureSettings.push(`"ss${String(set).padStart(2, '0')}" 1`)
      })
    }

    if (featureSettings.length > 0) {
      span.style.fontFeatureSettings = featureSettings.join(', ')
    }

    const numberTypeVal = toValue(numberType)
    if (numberTypeVal && numberTypeVal !== 'auto') {
      span.style.fontVariantNumeric = numberTypeVal
    }

    const numberWidthVal = toValue(numberWidth)
    if (numberWidthVal && numberWidthVal !== 'auto') {
      span.style.fontVariantNumeric = `${span.style.fontVariantNumeric} ${numberWidthVal}`.trim()
    }

    const cjkLatinSpacingVal = toValue(cjkLatinSpacing)
    if (cjkLatinSpacingVal === 'auto') {
      span.style.fontVariantEastAsian = 'proportional-width'
    }

    const baselineVal = toValue(baseline)
    if (baselineVal) {
      span.style.verticalAlign = String(baselineVal)
    }

    const topEdgeVal = toValue(topEdge)
    if (topEdgeVal) {
      span.style.marginTop = String(topEdgeVal)
    }

    const bottomEdgeVal = toValue(bottomEdge)
    if (bottomEdgeVal) {
      span.style.marginBottom = String(bottomEdgeVal)
    }

    const scriptVal = toValue(script)
    if (scriptVal && scriptVal !== 'auto') {
      span.style.fontVariantEastAsian = scriptVal
    }

    const regionVal = toValue(region)
    if (regionVal) {
      span.setAttribute('region', regionVal)
    }

    const featuresVal = toValue(features)
    if (featuresVal) {
      const settings = Array.isArray(featuresVal) ? featuresVal : [featuresVal]
      const featureStr = settings.map((setting) => {
        return Object.entries(setting)
          .map(([feature, value]) => `"${feature}" ${value}`)
          .join(', ')
      }).join(', ')

      if (featureStr) {
        span.style.fontFeatureSettings = span.style.fontFeatureSettings
          ? `${span.style.fontFeatureSettings}, ${featureStr}`
          : featureStr
      }
    }

    const costsValue = toValue(costs)
    if (costsValue) {
      if ('line' in costsValue) {
        span.style.setProperty('--line-break-cost', String(costsValue.line))
      }
      if ('wrap' in costsValue) {
        span.style.setProperty('--word-wrap-cost', String(costsValue.wrap))
      }
      if ('hyphen' in costsValue) {
        span.style.setProperty('--hyphenation-cost', String(costsValue.hyphen))
      }
    }

    if (toValue(overhang)) {
      span.style.textOverflow = 'clip'
      span.style.marginLeft = '-0.1em'
      span.style.marginRight = '-0.1em'
    }
  })
  span.append(...children())

  return span
})

builtins.set('text', component)
export default component
