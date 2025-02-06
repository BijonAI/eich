import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'
import { polygon } from 'idea-math'

interface polygonAtrributes{
  x:number,
  y:number
}

interface setPointsAtrributes{
  x:number,
  y:number
}

export interface PolygonAtrributes{
  $polygon: polygonAtrributes[],
  $setPoints: setPointsAtrributes[]
}

const component = defineComponent<PolygonAtrributes>((test) => {
  const {polygon} = useAttrs(test, ["polygon"]) as unknown as {
    polygon:polygonAtrributes[],
  }

  const p = setPointsAtrributes(...toValue(polygon))
}