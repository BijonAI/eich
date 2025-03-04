import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TbodyComponent from '../tbody'
import TrComponent from '../tr'

import '@testing-library/jest-dom'

describe('tbody component', () => {
  let container: HTMLElement

  // Register components
  builtins.set('tbody', TbodyComponent)
  builtins.set('tr', TrComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a tbody element', () => {
    const [nodes] = renderRoots(parse('<tbody></tbody>'), container)
    expect(nodes[0]).toBeInstanceOf(HTMLTableSectionElement)
  })

  it('should apply text alignment style', () => {
    const [nodes] = renderRoots(parse(`<tbody $text-align="'center'"></tbody>`), container)
    const tbody = nodes[0] as HTMLElement
    expect(tbody).toHaveStyle({
      textAlign: 'center',
    })
  })

  it('should apply vertical alignment style', () => {
    const [nodes] = renderRoots(parse(`<tbody $vertical-align="'middle'"></tbody>`), container)
    const tbody = nodes[0] as HTMLElement
    expect(tbody).toHaveStyle({
      verticalAlign: 'middle',
    })
  })

  it('should apply background color style', () => {
    const [nodes] = renderRoots(parse(`<tbody $background-color="'#f0f0f0'"></tbody>`), container)
    const tbody = nodes[0] as HTMLElement
    expect(tbody).toHaveStyle({
      backgroundColor: '#f0f0f0',
    })
  })

  it('should apply multiple styles at once', () => {
    const [nodes] = renderRoots(parse(`<tbody $text-align="'center'" $vertical-align="'middle'" $background-color="'#f0f0f0'"></tbody>`), container)
    const tbody = nodes[0] as HTMLElement
    expect(tbody).toHaveStyle({
      textAlign: 'center',
      verticalAlign: 'middle',
      backgroundColor: '#f0f0f0',
    })
  })

  it('should render children correctly', () => {
    const [nodes] = renderRoots(parse(`<tbody><tr></tr><tr></tr></tbody>`), container)
    const tbody = nodes[0] as HTMLElement
    expect(tbody.children).toHaveLength(2)
    expect(tbody.children[0]).toBeInstanceOf(HTMLTableRowElement)
    expect(tbody.children[1]).toBeInstanceOf(HTMLTableRowElement)
  })
})
