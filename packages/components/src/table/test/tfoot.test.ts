import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TfootComponent from '../tfoot'
import TrComponent from '../tr'

import '@testing-library/jest-dom'

describe('tfoot component', () => {
  let container: HTMLElement

  // Register components
  builtins.set('tfoot', TfootComponent)
  builtins.set('tr', TrComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a tfoot element', () => {
    const [nodes] = renderRoots(parse('<tfoot></tfoot>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableSectionElement)
  })

  it('should apply box model styles', () => {
    const [nodes] = renderRoots(parse(`<tfoot 
      $width="'100%'" 
      $height="'50px'"
      $border="'1px solid black'"
      $padding="'8px'"
      $margin="'4px'"
    ></tfoot>`), container)
    const tfoot = nodes[0] as HTMLElement
    expect(tfoot).toHaveStyle({
      width: '100%',
      height: '50px',
      border: '1px solid black',
      padding: '8px',
      margin: '4px',
    })
  })

  it('should apply background styles', () => {
    const [nodes] = renderRoots(parse(`<tfoot 
      $background-color="'#f0f0f0'"
      $background-image="'url(test.png)'"
      $background-position="'center'"
      $background-repeat="'no-repeat'"
    ></tfoot>`), container)
    const tfoot = nodes[0] as HTMLElement
    expect(tfoot).toHaveStyle({
      backgroundColor: '#f0f0f0',
      backgroundImage: 'url(test.png)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    })
  })

  it('should apply text styles', () => {
    const [nodes] = renderRoots(parse(`<tfoot 
      $color="'#333'"
      $font-family="'Arial'"
      $font-size="'14px'"
      $font-weight="'bold'"
      $text-align="'center'"
    ></tfoot>`), container)
    const tfoot = nodes[0] as HTMLElement
    expect(tfoot).toHaveStyle({
      color: '#333',
      fontFamily: 'Arial',
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign: 'center',
    })
  })

  it('should render children correctly', () => {
    const [nodes] = renderRoots(parse(`<tfoot><tr></tr><tr></tr></tfoot>`), container)
    const tfoot = nodes[0] as HTMLElement
    expect(tfoot.children).toHaveLength(2)
    expect(tfoot.children[0]).toBeInstanceOf(HTMLTableRowElement)
    expect(tfoot.children[1]).toBeInstanceOf(HTMLTableRowElement)
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<tfoot 
      $background-color="'#f0f0f0'"
      $text-align="'center'"
      $font-size="'14px'"
      $padding="'8px'"
    ><tr></tr></tfoot>`), container)
    const tfoot = nodes[0] as HTMLElement
    expect(tfoot).toHaveStyle({
      backgroundColor: '#f0f0f0',
      textAlign: 'center',
      fontSize: '14px',
      padding: '8px',
    })
    expect(tfoot.children[0]).toBeInstanceOf(HTMLTableRowElement)
  })
})
