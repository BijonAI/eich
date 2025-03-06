import { builtins, parse, renderRoots } from '@eichjs/renderer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import BlockComponent from '../block'
import GridComponent from '../grid'

import '@testing-library/jest-dom'

describe('grid Component', () => {
  let container: HTMLElement

  // Register component
  builtins.set('grid', GridComponent)
  builtins.set('block', BlockComponent)

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should create a basic grid element', () => {
    const [nodes] = renderRoots(parse('<grid></grid>'), container)
    const grid = nodes[0] as HTMLDivElement
    expect(grid).toBeInstanceOf(HTMLDivElement)
    expect(grid).toHaveStyle({
      display: 'grid',
    })
  })

  it('should apply grid template properties', () => {
    const [nodes] = renderRoots(parse(`<grid $template-rows="'100px 200px'" $template-columns="'1fr 2fr'" $template-areas="'header main'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toBeInstanceOf(HTMLDivElement)
    expect(grid).toHaveStyle({
      gridTemplateRows: '100px 200px',
      gridTemplateColumns: '1fr 2fr',
      gridTemplateAreas: 'header main',
    })
  })

  it('should apply grid auto properties', () => {
    const [nodes] = renderRoots(parse(`<grid $auto-flow="'row'" $auto-rows="'minmax(100px, auto)'" $auto-columns="'200px'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      gridAutoFlow: 'row',
      gridAutoRows: 'minmax(100px, auto)',
      gridAutoColumns: '200px',
    })
  })

  it('should apply gap properties', () => {
    const [nodes] = renderRoots(parse(`<grid $gap="'20px'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement
    expect(grid).toHaveStyle({
      gap: '20px',
    })
  })

  it('should apply individual gap properties when gap is not set', () => {
    const [nodes] = renderRoots(parse(`<grid $row-gap="'10px'" $column-gap="'20px'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      rowGap: '10px',
      columnGap: '20px',
    })
  })

  it('should prioritize gap over individual gap properties', () => {
    const [nodes] = renderRoots(parse(`<grid $gap="'30px'" $row-gap="'10px'" $column-gap="'20px'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      gap: '30px',
    })
    expect(grid.style.rowGap).toBe('')
    expect(grid.style.columnGap).toBe('')
  })

  it('should apply alignment properties', () => {
    const [nodes] = renderRoots(parse(`<grid $align-content="'center'" $align-items="'start'" $justify-content="'space-between'" $justify-items="'end'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      alignContent: 'center',
      alignItems: 'start',
      justifyContent: 'space-between',
      justifyItems: 'end',
    })
  })

  it('should apply place shorthand properties', () => {
    const [nodes] = renderRoots(parse(`<grid $place-content="'center space-between'" $place-items="'start end'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      placeContent: 'center space-between',
      placeItems: 'start end',
    })
  })

  it('should prioritize place properties over individual alignment properties', () => {
    const [nodes] = renderRoots(parse(`<grid $place-content="'center space-between'" $align-content="'start'" $justify-content="'end'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      placeContent: 'center space-between',
    })
    expect(grid.style.alignContent).toBe('')
    expect(grid.style.justifyContent).toBe('')
  })

  it('should prioritize grid shorthand over individual properties', () => {
    const [nodes] = renderRoots(parse(`<grid $grid="'auto-flow dense / 1fr 2fr'" $template-columns="'100px 200px'" $auto-flow="'row'"></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid).toHaveStyle({
      grid: 'auto-flow dense / 1fr 2fr',
    })
    expect(grid.style.gridTemplateColumns).toBe('')
    expect(grid.style.gridAutoFlow).toBe('')
  })

  it('should render children correctly', () => {
    const [nodes] = renderRoots(parse(`<grid><block>Item 1</block><block>Item 2</block></grid>`), container)
    const grid = nodes[0] as HTMLDivElement

    expect(grid.children).toHaveLength(2)
    expect(grid.textContent).toBe('Item 1Item 2')
  })
})
