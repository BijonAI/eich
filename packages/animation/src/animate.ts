export async function animate(fn: (progress: number) => void, dur: number, ease: (t: number) => number): Promise<void> {
  let elapsed = 0
  const startTime = performance.now()
  function updater() {
    elapsed = performance.now() - startTime
    fn(ease(elapsed / dur))
    if (elapsed >= dur)
      return
    requestAnimationFrame(updater)
  }
  requestAnimationFrame(updater)
}
