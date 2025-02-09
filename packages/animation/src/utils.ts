import { createAdhoc, getCurrentContext } from '@eichjs/renderer'

interface AnimationInfo {
  name: string | string[] // requried
  params: any[] // requried
  dur?: number
  ease?: string
}

// Syntax:
// fade-in,1000,linear
// fade-in,1000 (default as linear)
// fade-in,linear (default as 1000)
// fade-in (default as 1000, default as linear)
// fade-in,1000 fade-out-1500 (in order)
// (fade-in,darwing),1000,ease-in-out (in parallel)
// (fade-in,darwing),1000,ease-in-out fade-out,1500 (in parallel then in order)
// move(100,200),1000 (give params to animation)

export function splitAnimations(value: string): AnimationInfo[] {
  const result: AnimationInfo[] = []
  const groups = value.trim().split(/\s+/)

  for (const group of groups) {
    const info: AnimationInfo = {
      name: [],
      params: [],
      dur: 1000,
    }

    let part = group

    if (part.startsWith('(') && part.includes(')')) {
      const closingIndex = part.indexOf(')')
      info.name = part.slice(1, closingIndex).split(',')
      part = part.slice(closingIndex + 1)
    }
    else if (part.includes('(') && part.includes(')')) {
      const openIndex = part.indexOf('(')
      const closeIndex = part.indexOf(')')
      info.name = [part.slice(0, openIndex)]
      const params = part.slice(openIndex + 1, closeIndex).split(',').map(p => p.trim())
      info.params = params.map(p => createAdhoc(p, getCurrentContext())())
      part = part.slice(closeIndex + 1)
    }
    else {
      const nameEnd = part.indexOf(',')
      info.name = [nameEnd > -1 ? part.slice(0, nameEnd) : part]
      part = nameEnd > -1 ? part.slice(nameEnd) : ''
    }

    if (part.startsWith(',')) {
      const params = part.slice(1).split(',')
      params.forEach((param, index) => {
        if (index === 0 && !Number.isNaN(Number(param))) {
          info.dur = Number(param)
        }
        else if (param) {
          info.ease = param
        }
      })
    }

    result.push(info)
  }

  return result
}

export function convertSnakeCaseToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
