const eventTypesToNames = {
  'track.started': 'Instruqt Track Started',
  'track.completed': 'Instruqt Track Completed',
  'track.challenge_started': 'Instruqt Challenge Started',
  'track.challenge_completed': 'Instruqt Challenge Completed',
}

// Sends instruqt activity data to Heap
export function trackInstruqtEvent(
  e: MessageEvent,
  options: { labId: string }
) {
  const eventData = e.data

  if (e.origin && e.origin.indexOf('instruqt.com') >= 0) {
    const eventName =
      eventTypesToNames[eventData.event] || 'Instruqt Track Progressed'

    const properties = {
      id: options.labId,
      track_slug: eventData.params.track_slug,
      event: eventData.event,
    }

    window.analytics?.track(eventName, properties)
  }
}
