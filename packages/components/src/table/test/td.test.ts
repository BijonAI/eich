import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TdComponent from '../td'

import '@testing-library/jest-dom'

describe('td component', () => {
  let container: HTMLElement

  // Register component
  builtins.set('td', TdComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a td element', () => {
    const [nodes] = renderRoots(parse('<td></td>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableCellElement)
  })

  it('should apply padding style', () => {
    const [nodes] = renderRoots(parse(`<td $padding="'8px'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      padding: '8px',
    })
  })

  it('should apply border style', () => {
    const [nodes] = renderRoots(parse(`<td $border="'1px solid black'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      border: '1px solid black',
    })
  })

  it('should apply text alignment', () => {
    const [nodes] = renderRoots(parse(`<td $text-align="'center'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      textAlign: 'center',
    })
  })

  it('should apply vertical alignment', () => {
    const [nodes] = renderRoots(parse(`<td $vertical-align="'middle'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      verticalAlign: 'middle',
    })
  })

  it('should apply width and height', () => {
    const [nodes] = renderRoots(parse(`<td $width="'100px'" $height="'50px'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      width: '100px',
      height: '50px',
    })
  })

  it('should apply background color and text color', () => {
    const [nodes] = renderRoots(parse(`<td $background-color="'#f0f0f0'" $color="'#333'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      backgroundColor: '#f0f0f0',
      color: '#333',
    })
  })

  it('should apply font styles', () => {
    const [nodes] = renderRoots(parse(`<td $font-size="'14px'" $font-weight="'bold'"></td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      fontSize: '14px',
      fontWeight: 'bold',
    })
  })

  it('should render content correctly', () => {
    const [nodes] = renderRoots(parse(`<td>Cell Content</td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td.textContent).toBe('Cell Content')
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<td 
      $padding="'8px'"
      $text-align="'center'"
      $background-color="'#f0f0f0'"
      $font-size="'14px'"
    >Content</td>`), container)
    const td = nodes[0] as HTMLElement
    expect(td).toHaveStyle({
      padding: '8px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      fontSize: '14px',
    })
    expect(td.textContent).toBe('Content')
  })
})
