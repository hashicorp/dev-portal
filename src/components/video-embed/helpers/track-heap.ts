// TODO: do we drop heap tracking in dev-dot considering we've
// got a unified analytics plan around Segment?
function trackHeap(event: string, url: string) {
  window.heap?.track(event, { url })
}

export function trackHeapStarted(url: string) {
  trackHeap('Video Started', url)
}

export function trackHeapEnded(url: string) {
  trackHeap('Video Ended', url)
}
