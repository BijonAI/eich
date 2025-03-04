import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ColgroupComponent from '../colgroup'

import '@testing-library/jest-dom'

describe('colgroup component', () => {
  let container: HTMLElement

  // Register component
  builtins.set('colgroup', ColgroupComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a colgroup element', () => {
    const [nodes] = renderRoots(parse('<colgroup></colgroup>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableColElement)
  })

  it('should apply width style', () => {
    const [nodes] = renderRoots(parse(`<colgroup $width="'100px'"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLElement
    expect(colgroup).toHaveStyle({
      width: '100px',
    })
  })

  it('should apply background color', () => {
    const [nodes] = renderRoots(parse(`<colgroup $background-color="'#f0f0f0'"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLElement
    expect(colgroup).toHaveStyle({
      backgroundColor: '#f0f0f0',
    })
  })

  it('should apply border style', () => {
    const [nodes] = renderRoots(parse(`<colgroup $border="'1px solid black'"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLElement
    expect(colgroup).toHaveStyle({
      border: '1px solid black',
    })
  })

  it('should apply text alignment', () => {
    const [nodes] = renderRoots(parse(`<colgroup $text-align="'center'"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLElement
    expect(colgroup).toHaveStyle({
      textAlign: 'center',
    })
  })

  it('should apply vertical alignment', () => {
    const [nodes] = renderRoots(parse(`<colgroup $vertical-align="'middle'"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLElement
    expect(colgroup).toHaveStyle({
      verticalAlign: 'middle',
    })
  })

  it('should apply visibility style', () => {
    const [nodes] = renderRoots(parse(`<colgroup $visibility="'hidden'"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLElement
    expect(colgroup).toHaveStyle({
      visibility: 'hidden',
    })
  })

  it('should set span attribute', () => {
    const [nodes] = renderRoots(parse(`<colgroup $span="2"></colgroup>`), container)
    const colgroup = nodes[0] as HTMLTableColElement
    expect(colgroup.span).toBe(2)
  })

  it('should apply multiple attributes at once', () => {
    const [nodes] = renderRoots(parse(`<colgroup 
      $width="'200px'" 
      $background-color="'#eee'" 
      $text-align="'center'" 
      $span="3"
    ></colgroup>`), container)
    const colgroup = nodes[0] as HTMLTableColElement
    expect(colgroup).toHaveStyle({
      width: '200px',
      backgroundColor: '#eee',
      textAlign: 'center',
    })
    expect(colgroup.span).toBe(3)
  })
})
