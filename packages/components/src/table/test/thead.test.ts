import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TheadComponent from '../thead'
import TrComponent from '../tr'

import '@testing-library/jest-dom'

describe('thead component', () => {
  let container: HTMLElement

  // Register components
  builtins.set('thead', TheadComponent)
  builtins.set('tr', TrComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a thead element', () => {
    const [nodes] = renderRoots(parse('<thead></thead>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableSectionElement)
  })

  it('should apply text alignment style', () => {
    const [nodes] = renderRoots(parse(`<thead $text-align="'center'"></thead>`), container)
    const thead = nodes[0] as HTMLElement
    expect(thead).toHaveStyle({
      textAlign: 'center',
    })
  })

  it('should apply vertical alignment style', () => {
    const [nodes] = renderRoots(parse(`<thead $vertical-align="'middle'"></thead>`), container)
    const thead = nodes[0] as HTMLElement
    expect(thead).toHaveStyle({
      verticalAlign: 'middle',
    })
  })

  it('should apply background color style', () => {
    const [nodes] = renderRoots(parse(`<thead $background-color="'#f0f0f0'"></thead>`), container)
    const thead = nodes[0] as HTMLElement
    expect(thead).toHaveStyle({
      backgroundColor: '#f0f0f0',
    })
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<thead 
      $text-align="'center'" 
      $vertical-align="'middle'" 
      $background-color="'#f0f0f0'"
    ></thead>`), container)
    const thead = nodes[0] as HTMLElement
    expect(thead).toHaveStyle({
      textAlign: 'center',
      verticalAlign: 'middle',
      backgroundColor: '#f0f0f0',
    })
  })

  it('should render children correctly', () => {
    const [nodes] = renderRoots(parse(`<thead><tr></tr><tr></tr></thead>`), container)
    const thead = nodes[0] as HTMLElement
    expect(thead.children).toHaveLength(2)
    expect(thead.children[0]).toBeInstanceOf(HTMLTableRowElement)
    expect(thead.children[1]).toBeInstanceOf(HTMLTableRowElement)
  })
})
