import { useCallback, useEffect, useState } from 'react'
import { PlayState } from '../types'

/**
 * A tuple representing the start and end times
 * of an interval in the video, used for progress tracking
 */
type SegmentPlayed = [number, number]

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
  collectMoment: (playTimeMoment: number) => void
} {
  const [segmentsPlayed, setSegmentsPlayed] = useState<SegmentPlayed[]>([])

  /**
   * Allows individual moments of playtime to be collected and
   * consolidated into the array of segmentsPlayed
   */
  const collectMomentPlayed = useCallback(
    (playedTime: number) => {
      setSegmentsPlayed((prev: SegmentPlayed[]) =>
        addMomentPlayedToSegments(
          playedTime,
          prev,
          progressInterval,
          maxPlaybackSpeed
        )
      )
    },
    [maxPlaybackSpeed, progressInterval]
  )

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

  const segmentSecondsPlayed = segmentsPlayed.reduce(
    (totalSeconds: number, segment: [number, number]) => {
      return totalSeconds + (segment[1] - segment[0])
    },
    0
  )
  const segmentsPercent = !playState.duration
    ? 0
    : Math.round((segmentSecondsPlayed / playState.duration) * 1000) / 10

  return {
    list: segmentsPlayed,
    percent: segmentsPercent,
    collectMoment: collectMomentPlayed,
  }
}

function addMomentPlayedToSegments(
  rawPlayedTimeEnd: number,
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
  const playedTimeEnd = Math.round(rawPlayedTimeEnd * 100) / 100
  const playedTimeStart = Math.max(0, playedTimeEnd - maxVideoElapsed)
  // If there are no segments yet, make the first one
  // with this playedTime interval
  if (segments.length == 0) {
    return [[playedTimeStart, playedTimeEnd]]
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
      playedTimeEnd >= segment[0] && playedTimeEnd <= segment[1]
    if (isWithinMatch) {
      isUsed = true
    }
    // Match times which extend a segment
    const isExtensionMatch =
      segment[1] < playedTimeEnd &&
      segment[1] + maxVideoElapsed >= playedTimeEnd
    if (isExtensionMatch) {
      segment[1] = playedTimeEnd
      isUsed = true
    }
    return segment
  })
  // If this playedTimeEnd was not used on an existing segment,
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
