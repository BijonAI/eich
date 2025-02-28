import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface VideoAttributes {
  // Source attributes - reactive as they might change
  $src?: string
  $width?: string | number
  $height?: string | number
  $poster?: string

  // Playback attributes - reactive as they control playback state
  $currentTime?: number
  $volume?: number
  $playbackRate?: number
  $preload?: 'none' | 'metadata' | 'auto'

  // Boolean attributes - might need to change during runtime
  $autoplay?: boolean
  $loop?: boolean
  $muted?: boolean
  $controls?: boolean
  $playsInline?: boolean

  // Static attributes
  crossorigin?: 'anonymous' | 'use-credentials'
  controlslist?: string
  disablePictureInPicture?: boolean
  disableRemotePlayback?: boolean
}

const component = defineComponent<VideoAttributes>((attrs, children) => {
  const props = useAttrs(attrs, [
    'src',
    'width',
    'height',
    'poster',
    'currentTime',
    'volume',
    'playbackRate',
    'preload',
    'autoplay',
    'loop',
    'muted',
    'controls',
    'playsInline',
    'crossorigin',
    'controlslist',
    'disablePictureInPicture',
    'disableRemotePlayback',
  ])
  const element = document.createElement('video')

  effect(() => {
    // Source attributes
    if (props.src) {
      element.src = toValue(props.src)
    }
    if (props.width) {
      element.width = Number(toValue(props.width)) || 0
    }
    if (props.height) {
      element.height = Number(toValue(props.height)) || 0
    }
    if (props.poster) {
      element.poster = toValue(props.poster)
    }

    // Playback attributes
    if (props.currentTime !== undefined) {
      element.currentTime = Number(toValue(props.currentTime))
    }
    if (props.volume !== undefined) {
      element.volume = Number(toValue(props.volume))
    }
    if (props.playbackRate !== undefined) {
      element.playbackRate = Number(toValue(props.playbackRate))
    }
    if (props.preload) {
      element.preload = toValue(props.preload) as 'none' | 'metadata' | 'auto'
    }

    // Boolean attributes
    if (props.autoplay !== undefined) {
      element.autoplay = Boolean(toValue(props.autoplay))
    }
    if (props.loop !== undefined) {
      element.loop = Boolean(toValue(props.loop))
    }
    if (props.muted !== undefined) {
      element.muted = Boolean(toValue(props.muted))
    }
    if (props.controls !== undefined) {
      element.controls = Boolean(toValue(props.controls))
    }
    if (props.playsInline !== undefined) {
      element.playsInline = Boolean(toValue(props.playsInline))
    }

    // Static attributes
    if (props.crossorigin) {
      element.crossOrigin = toValue(props.crossorigin)
    }
    if (props.controlslist) {
      element.setAttribute('controlslist', toValue(props.controlslist))
    }
    if (props.disablePictureInPicture !== undefined) {
      element.disablePictureInPicture = Boolean(toValue(props.disablePictureInPicture))
    }
    if (props.disableRemotePlayback !== undefined) {
      element.setAttribute('disableremoteplayback', '')
    }

    element.append(...children())
  })

  return element
})

builtins.set('video', component)

export default component
