import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CaptionComponent from '../caption'

import '@testing-library/jest-dom'

describe('caption component', () => {
  let container: HTMLElement

  // Register component
  builtins.set('caption', CaptionComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a caption element', () => {
    const [nodes] = renderRoots(parse('<caption></caption>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableCaptionElement)
  })

  it('should apply text alignment style', () => {
    const [nodes] = renderRoots(parse(`<caption $text-align="'center'"></caption>`), container)
    const caption = nodes[0] as HTMLElement
    expect(caption).toHaveStyle({
      textAlign: 'center',
    })
  })

  it('should apply caption side position', () => {
    const [nodes] = renderRoots(parse(`<caption $caption-side="'bottom'"></caption>`), container)
    const caption = nodes[0] as HTMLElement
    expect(caption).toHaveStyle({
      captionSide: 'bottom',
    })
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<caption $text-align="'right'" $caption-side="'top'"></caption>`), container)
    const caption = nodes[0] as HTMLElement
    expect(caption).toHaveStyle({
      textAlign: 'right',
      captionSide: 'top',
    })
  })

  it('should render text content correctly', () => {
    const [nodes] = renderRoots(parse(`<caption>Table Caption</caption>`), container)
    const caption = nodes[0] as HTMLElement
    expect(caption.textContent).toBe('Table Caption')
  })
})
