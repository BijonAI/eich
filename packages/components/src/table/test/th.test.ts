import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ThComponent from '../th'

import '@testing-library/jest-dom'

describe('th component', () => {
  let container: HTMLElement

  // Register component
  builtins.set('th', ThComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a th element', () => {
    const [nodes] = renderRoots(parse('<th></th>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableCellElement)
  })

  it('should apply box model styles', () => {
    const [nodes] = renderRoots(parse(`<th 
      $padding="'8px'"
      $border="'1px solid black'"
      $width="'100px'"
      $height="'50px'"
    ></th>`), container)
    const th = nodes[0] as HTMLElement
    expect(th).toHaveStyle({
      padding: '8px',
      border: '1px solid black',
      width: '100px',
      height: '50px',
    })
  })

  it('should apply alignment styles', () => {
    const [nodes] = renderRoots(parse(`<th 
      $text-align="'center'"
      $vertical-align="'middle'"
    ></th>`), container)
    const th = nodes[0] as HTMLElement
    expect(th).toHaveStyle({
      textAlign: 'center',
      verticalAlign: 'middle',
    })
  })

  it('should apply color styles', () => {
    const [nodes] = renderRoots(parse(`<th 
      $background-color="'#f0f0f0'"
      $color="'#333'"
    ></th>`), container)
    const th = nodes[0] as HTMLElement
    expect(th).toHaveStyle({
      backgroundColor: '#f0f0f0',
      color: '#333',
    })
  })

  it('should apply font styles', () => {
    const [nodes] = renderRoots(parse(`<th 
      $font-size="'14px'"
      $font-weight="'bold'"
    ></th>`), container)
    const th = nodes[0] as HTMLElement
    expect(th).toHaveStyle({
      fontSize: '14px',
      fontWeight: 'bold',
    })
  })

  it('should set scope attribute', () => {
    const [nodes] = renderRoots(parse(`<th $scope="'col'"></th>`), container)
    const th = nodes[0] as HTMLTableCellElement
    expect(th.scope).toBe('col')
  })

  it('should render content correctly', () => {
    const [nodes] = renderRoots(parse(`<th>Header Cell</th>`), container)
    const th = nodes[0] as HTMLElement
    expect(th.textContent).toBe('Header Cell')
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<th 
      $padding="'8px'"
      $text-align="'center'"
      $background-color="'#f0f0f0'"
      $font-weight="'bold'"
      $scope="'row'"
    >Header</th>`), container)
    const th = nodes[0] as HTMLTableCellElement
    expect(th).toHaveStyle({
      padding: '8px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
    })
    expect(th.scope).toBe('row')
    expect(th.textContent).toBe('Header')
  })
})
