import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import TableComponent from '../table'
import TdComponent from '../td'
import TrComponent from '../tr'

import '@testing-library/jest-dom'

describe('table Component', () => {
  let container: HTMLElement
  // Register components
  builtins.set('table', TableComponent)
  builtins.set('tr', TrComponent)
  builtins.set('td', TdComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a basic table element', () => {
    const [nodes] = renderRoots(parse('<table></table>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableElement)
  })

  it('should apply basic style attributes', () => {
    const [nodes] = renderRoots(parse(`<table $border="'1px solid black'" $width="'100%'" $height="'200px'"></table>`), container)
    const table = nodes[0] as HTMLTableElement

    expect(table).toHaveStyle({
      border: '1px solid black',
      width: '100%',
      height: '200px',
    })
  })

  it('should apply individual border properties', () => {
    const [nodes] = renderRoots(parse(`<table $border-width="'2px'" $border-style="'dashed'" $border-color="'red'"></table>`), container)
    const table = nodes[0] as HTMLTableElement

    expect(table).toHaveStyle({
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: 'red',
    })
  })

  it('should apply table layout attributes', () => {
    const [nodes] = renderRoots(parse(`<table $border-collapse="'collapse'" $border-spacing="'2px'" $caption-side="'bottom'" $empty-cells="'hide'" $table-layout="'fixed'"></table>`), container)
    const table = nodes[0] as HTMLTableElement

    expect(table).toHaveStyle({
      borderCollapse: 'collapse',
      borderSpacing: '2px',
      captionSide: 'bottom',
      emptyCells: 'hide',
      tableLayout: 'fixed',
    })
  })

  it('should apply alignment and text attributes', () => {
    const [nodes] = renderRoots(parse(`<table $vertical-align="'middle'" $text-align="'center'"></table>`), container)
    const table = nodes[0] as HTMLTableElement

    expect(table).toHaveStyle({
      verticalAlign: 'middle',
      textAlign: 'center',
    })
  })

  it('should apply appearance attributes', () => {
    const [nodes] = renderRoots(parse(`<table $background-color="'#f0f0f0'" $color="'#333'" $padding="'10px'" $border-radius="'4px'" $box-shadow="'0 2px 4px rgba(0,0,0,0.1)'"></table>`), container)
    const table = nodes[0] as HTMLTableElement

    expect(table).toHaveStyle({
      backgroundColor: '#f0f0f0',
      color: '#333',
      padding: '10px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    })
  })

  it('should render children correctly', () => {
    const [nodes] = renderRoots(parse(`<table><tr><td>Cell content</td></tr></table>`), container)
    const table = nodes[0] as HTMLTableElement

    expect(table.textContent).toBe('Cell content')
    expect(table.querySelector('tr')).toBeTruthy()
    expect(table.querySelector('td')).toBeTruthy()
  })
})
