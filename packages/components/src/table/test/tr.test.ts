import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TdComponent from '../td'
import TrComponent from '../tr'

import '@testing-library/jest-dom'

describe('tr component', () => {
  let container: HTMLElement

  // Register components
  builtins.set('tr', TrComponent)
  builtins.set('td', TdComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a tr element', () => {
    const [nodes] = renderRoots(parse('<tr></tr>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableRowElement)
  })

  it('should apply box model styles', () => {
    const [nodes] = renderRoots(parse(`<tr 
      $padding="'8px'"
      $border="'1px solid black'"
      $width="'100%'"
      $height="'50px'"
    ></tr>`), container)
    const tr = nodes[0] as HTMLElement
    expect(tr).toHaveStyle({
      padding: '8px',
      border: '1px solid black',
      width: '100%',
      height: '50px',
    })
  })

  it('should apply alignment styles', () => {
    const [nodes] = renderRoots(parse(`<tr 
      $text-align="'center'"
      $vertical-align="'middle'"
    ></tr>`), container)
    const tr = nodes[0] as HTMLElement
    expect(tr).toHaveStyle({
      textAlign: 'center',
      verticalAlign: 'middle',
    })
  })

  it('should apply color styles', () => {
    const [nodes] = renderRoots(parse(`<tr 
      $background-color="'#f0f0f0'"
      $color="'#333'"
    ></tr>`), container)
    const tr = nodes[0] as HTMLElement
    expect(tr).toHaveStyle({
      backgroundColor: '#f0f0f0',
      color: '#333',
    })
  })

  it('should apply font styles', () => {
    const [nodes] = renderRoots(parse(`<tr 
      $font-size="'14px'"
      $font-weight="'bold'"
    ></tr>`), container)
    const tr = nodes[0] as HTMLElement
    expect(tr).toHaveStyle({
      fontSize: '14px',
      fontWeight: 'bold',
    })
  })

  it('should render children correctly', () => {
    const [nodes] = renderRoots(parse(`<tr><td>Cell 1</td><td>Cell 2</td></tr>`), container)
    const tr = nodes[0] as HTMLElement
    expect(tr.children).toHaveLength(2)
    expect(tr.children[0]).toBeInstanceOf(HTMLTableCellElement)
    expect(tr.children[1]).toBeInstanceOf(HTMLTableCellElement)
    expect(tr.children[0].textContent).toBe('Cell 1')
    expect(tr.children[1].textContent).toBe('Cell 2')
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<tr 
      $padding="'8px'"
      $text-align="'center'"
      $background-color="'#f0f0f0'"
      $font-size="'14px'"
    ><td>Cell</td></tr>`), container)
    const tr = nodes[0] as HTMLElement
    expect(tr).toHaveStyle({
      padding: '8px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      fontSize: '14px',
    })
    expect(tr.children[0]).toBeInstanceOf(HTMLTableCellElement)
    expect(tr.children[0].textContent).toBe('Cell')
  })
})
