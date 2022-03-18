// Sends instruqt activity data to Heap
export function trackInstruqtEvent(
  e: MessageEvent,
  options: { labId: string }
) {
  const eventData = e.data

  if (e.origin && e.origin.indexOf('instruqt.com') >= 0) {
    let evtName = ''

    switch (eventData.event) {
      case 'track.started':
        evtName = 'Instruqt Track Started'
        break
      case 'track.completed':
        evtName = 'Instruqt Track Completed'
        break
      case 'track.challenge_started':
        evtName = 'Instruqt Challenge Started'
        break
      case 'track.challenge_completed':
        evtName = 'Instruqt Challenge Completed'
        break
      default:
        evtName = 'Instruqt Track Progressed'
        break
    }

    const properties = {
      id: options.labId,
      track_slug: eventData.params.track_slug,
      event: eventData.event,
    }

    window.analytics?.track(evtName, properties)
  }
}
