// Sends instruqt activity data to Heap
export function trackInstruqtEvent(
  e: MessageEvent,
  options: { labId: string }
) {
  const eventData = e.data

  if (e.origin && e.origin.indexOf('instruqt.com') >= 0) {
    let eventName = ''

    switch (eventData.event) {
      case 'track.started':
        eventName = 'Instruqt Track Started'
        break
      case 'track.completed':
        eventName = 'Instruqt Track Completed'
        break
      case 'track.challenge_started':
        eventName = 'Instruqt Challenge Started'
        break
      case 'track.challenge_completed':
        eventName = 'Instruqt Challenge Completed'
        break
      default:
        eventName = 'Instruqt Track Progressed'
        break
    }

    const properties = {
      id: options.labId,
      track_slug: eventData.params.track_slug,
      event: eventData.event,
    }

    window.analytics?.track(eventName, properties)
  }
}
