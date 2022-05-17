export function addPlayedTimeToSegments(
  rawPlayedTimeEnd: number,
  segments: [number, number][],
  progressInterval: number = 1
): [number, number][] {
  // Handle potential 2x playback, compromising a second or two of precision,
  // and add a little buffer to smooth overlap calculations
  const intervalBuffer = progressInterval * 2 + 0.1
  const playedTimeEnd = Math.round(rawPlayedTimeEnd * 100) / 100
  const playedTimeStart = Math.max(0, playedTimeEnd - progressInterval)
  // If there are no segments yet, make the first one with this playedTime interval
  if (segments.length == 0) {
    return [[playedTimeStart, playedTimeEnd]]
  }
  // If this playedTimeEnd is within "progressInterval" of the
  // end of an existing segment, then use it to extend that segment
  let isUsed = false
  const updatedSegments = segments.map((segment: [number, number]) => {
    if (isUsed) {
      return segment
    }
    // Match times which fall within a segment
    const isWithinMatch =
      playedTimeEnd >= segment[0] && playedTimeEnd <= segment[1]
    if (isWithinMatch) {
      isUsed = true
    }
    // Match times which extend a segment
    const isExtensionMatch =
      segment[1] < playedTimeEnd && segment[1] + intervalBuffer >= playedTimeEnd
    if (isExtensionMatch) {
      segment[1] = playedTimeEnd
      isUsed = true
    }
    return segment
  })
  // If this playedTimeEnd was not used to extend an existing segment,
  // then start a new segment for this playedTime
  if (!isUsed) {
    updatedSegments.push([playedTimeStart, playedTimeEnd])
  }
  // Sort segments by start time, to prepare to consolidate them
  const sortedSegments = updatedSegments.sort((a, b) => a[0] - b[0])
  // Consolidate back-to-back segments which overlap or nearly overlap
  const consolidatedSegments = sortedSegments.reduce((acc, segment) => {
    if (acc.length == 0) {
      // If this is the first segment, push it and move on
      acc.push(segment)
    } else {
      const lastSegment = acc[acc.length - 1]
      const isOverlapping = segment[0] <= lastSegment[1]
      if (isOverlapping) {
        // If this segment start time overlaps with the
        // previous segment end time, then combine the segments
        const consolidatedSegment = [
          lastSegment[0],
          Math.max(lastSegment[1], segment[1]),
        ]
        acc[acc.length - 1] = consolidatedSegment
      } else {
        // Otherwise, push this segment, as it does not overlap with others
        acc.push(segment)
      }
    }
    return acc
  }, [])
  // Return the sorted, consolidated segments
  return consolidatedSegments
}
