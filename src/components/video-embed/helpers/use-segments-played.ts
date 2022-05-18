import { useCallback, useEffect, useState } from 'react'
import { PlayState } from '../types'

/**
 * A tuple representing the start and end times
 * of an interval in the video, used for progress tracking
 */
type SegmentPlayed = {
  start: number
  end: number
}

/**
 * Note that segmentsPlayed requires PROGRESS_INTERVAL and MAX_PLAYBACK_SPEED
 * in order to function correctly. This is because it builds its array
 * of segments played based on "moments of progress", as derived
 * from playState.position changes.
 *
 * - A "moment of progress" is represented by a playState.position that is
 *   visited while playState.isPlaying is true.
 *
 * - PROGRESS_INTERVAL represents the time in milliseconds between these events
 *   being reported. It is needed to accurately report viewing progress.
 *   When a "moment of progress" is reported, we assume that the
 *   previous PROGRESS_INTERVAL of video (usually 1 second) has been viewed.
 *
 * - MAX_PLAYBACK SPEED is the maximum ratio at which the video can play.
 *   It is also needed to accurately report viewing progress in those cases
 *   where playback speed is faster than 1.0x. At 2.0x speed, for example,
 *   "moments of progress" will be reported ever 1 second, but between each
 *   moment, 2 seconds of video will have been watched. So, when a
 *   "moment of progress" is reported, we in fact need to assume that the
 *   previous PROGRESS_INTERVAL * MAX_PLAYBACK_SPEED has been viewed.
 */
export function useSegmentsPlayed(
  playState: PlayState,
  progressInterval: number,
  maxPlaybackSpeed: number
): {
  list: SegmentPlayed[]
  percent: number
} {
  const [segmentsPlayed, setSegmentsPlayed] = useState<SegmentPlayed[]>([])

  /**
   * Allows individual "moments of progress" to be collected and
   * consolidated into the array of segmentsPlayed.
   * Note: in a callback to prevent useEffect() constantly firing
   */
  const collectMomentPlayed = useCallback(
    (playPosition: number) => {
      setSegmentsPlayed((prevSegmentsPlayed: SegmentPlayed[]) =>
        addMomentPlayedToSegments(
          playPosition,
          prevSegmentsPlayed,
          progressInterval,
          maxPlaybackSpeed
        )
      )
    },
    [maxPlaybackSpeed, progressInterval]
  )

  /**
   * When the play state changes, if we're actively playing, or at video end,
   * then collect that as a "moment of progress" (as described at top of file).
   */
  useEffect(() => {
    /**
     * If the video is playing, and a position (or duration) change comes in,
     * we wanted to capture that moment of active playback
     */
    const isPlayingMoment = playState.isPlaying
    /**
     * We expect playState.position to be updated to the very end of the video
     * when the video is complete, but at that point we also expect isPlaying
     * to be false. So we have a special case to capture the moment the video
     * has ended, to ensure % progress is tracked right up to the end.
     */
    const isEndedMoment = playState.position == playState.duration
    if (isPlayingMoment || isEndedMoment) {
      collectMomentPlayed(playState.position)
    }
  }, [playState, collectMomentPlayed])

  /**
   * Add up the length of each segment viewed to get the total amount
   * of content viewed, in seconds.
   *
   * Note that segmentsPlayed are consolidated to avoid overlap.
   * This means we can run a relatively simple reduce to get the total.
   */
  const segmentSecondsPlayed = segmentsPlayed.reduce(
    (totalSeconds: number, segment: SegmentPlayed) => {
      return totalSeconds + (segment.end - segment.start)
    },
    0
  )

  /**
   * The percent of content viewed is the total across all segments viewed,
   * divided by the total possible seconds of content to view, which is
   * the video's full duration.
   *
   * Note that playState.duration _may_ not be defined,
   * it's unlikely, but we double-check that it is to be safe.
   */
  const segmentsPercent = playState.duration
    ? Math.round((segmentSecondsPlayed / playState.duration) * 1000) / 10
    : 0

  /**
   * Note: we return the list of segmentsPlayed here, but don't use it for now.
   * During development it was used to build a visualization of play progress,
   * and was useful for debugging.
   */
  return {
    list: segmentsPlayed,
    percent: segmentsPercent,
  }
}

/**
 * Given a currently playing playPosition, and a list of existing segments,
 * as well as broader reporting interval and maxPlaybackSpeed settings,
 *
 * Return a new list of segments that includes the currently playing position.
 * In this new list, overlapping segments are combined to avoid duplicates.
 */
function addMomentPlayedToSegments(
  playPosition: number,
  segments: SegmentPlayed[],
  progressInterval: number,
  maxPlaybackSpeed: number
): SegmentPlayed[] {
  // maxVideoElapsed is the amount of video a viewer could have potentially
  // watched since the last "moment of progress" was reported.
  // This calculation handles faster playback speeds (usually up to 2.0x),
  // which comes at the cost of compromising a second or two of precision.
  // We also add 0.1 seconds of overlap to smooth calculations
  // (sometimes progress reports lag just slightly in react-player))
  const maxVideoElapsed = (progressInterval / 1000) * maxPlaybackSpeed + 0.1
  const playedTimeEnd = Math.round(playPosition * 100) / 100
  const playedTimeStart = Math.max(0, playedTimeEnd - maxVideoElapsed)
  // If there are no segments yet, make the first one
  // with this playedTime interval
  if (segments.length == 0) {
    return [{ start: playedTimeStart, end: playedTimeEnd }]
  }
  // If this playedTimeEnd is within or overlaps with the end of an existing
  // segment, then roll it into that segment
  let isUsed = false
  const updatedSegments = segments.map((segment: SegmentPlayed) => {
    if (isUsed) {
      return segment
    }
    // Match times which fall within a segment
    const isWithinMatch =
      playedTimeEnd >= segment.start && playedTimeEnd <= segment.end
    if (isWithinMatch) {
      isUsed = true
      return segment
    }
    // Match times which extend a segment
    const isExtensionMatch =
      segment.end < playedTimeEnd &&
      segment.end + maxVideoElapsed >= playedTimeEnd
    if (isExtensionMatch) {
      segment.end = playedTimeEnd
      isUsed = true
      return segment
    }
    // Note that we won't always be able to consolidate the new play position
    // into existing segments (eg right after scrobbling).
    return segment
  })
  // If this playedTimeEnd was not used on an existing segment,
  // then start a new segment for this playedTime
  if (!isUsed) {
    updatedSegments.push({ start: playedTimeStart, end: playedTimeEnd })
  }
  // Sort segments by start time, to prepare to consolidate them
  const sortedSegments = updatedSegments.sort((a, b) => a[0] - b[0])
  // Consolidate back-to-back segments which overlap or nearly overlap
  const consolidatedSegments = sortedSegments.reduce(
    (acc: SegmentPlayed[], segment: SegmentPlayed) => {
      if (acc.length == 0) {
        // If this is the first segment, push it and move on
        acc.push(segment)
      } else {
        const prevSegment = acc[acc.length - 1]
        const isOverlapping = segment.start <= prevSegment.end
        if (isOverlapping) {
          // If this segment start time overlaps with the
          // previous segment end time, then combine the segments
          const consolidatedSegment = {
            start: prevSegment.start,
            end: Math.max(prevSegment.end, segment.end),
          }
          acc[acc.length - 1] = consolidatedSegment
        } else {
          // Otherwise, push this segment, as it does not overlap with others
          acc.push(segment)
        }
      }
      return acc
    },
    []
  )
  // Return the sorted, consolidated segments
  return consolidatedSegments
}
