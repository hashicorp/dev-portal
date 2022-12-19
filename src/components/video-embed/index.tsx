import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import classNames from 'classnames'
import { VideoEmbedProps, VideoEmbedInnerProps } from './types'
import {
	usePlayState,
	useSegmentsPlayed,
	// useSecondsWatched, // Not used... yet!
	videoPlayedEvent,
	useMilestones,
} from './helpers'
import s from './video-embed.module.css'

/**
 * MAX_PLAYBACK_SPEED is based on max speeds for YouTube & Wistia.
 * PROGRESS_INTERVAL is react-player's default value, declared again to make
 *   its role in the useSegmentsPlayed hook more clear.
 */
const PROGRESS_INTERVAL = 1000
const MAX_PLAYBACK_SPEED = 2.0
const ICON_SIZE = '64px'

/**
 * Placeholder abstracted from: https://github.com/cookpete/react-player/blob/master/src/Preview.js
 *
 * For use during SSR to avoid hydration errors.
 */
function VideoEmbedPlaceholder({ imageUrl }) {
	const flexCenter = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
	const styles = {
		preview: {
			position: 'absolute' as const,
			top: '0',
			width: '100%',
			height: '100%',
			backgroundImage: `url(${imageUrl})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			cursor: 'pointer',
			...flexCenter,
		},
		shadow: {
			background: 'radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)',
			borderRadius: ICON_SIZE,
			width: ICON_SIZE,
			height: ICON_SIZE,
			position: undefined,
			...flexCenter,
		},
		playIcon: {
			borderStyle: 'solid',
			borderWidth: '16px 0 16px 26px',
			borderColor: 'transparent transparent transparent white',
			marginLeft: '7px',
		},
	}
	const defaultPlayIcon = (
		<div style={styles.shadow} className="react-player__shadow">
			<div style={styles.playIcon} className="react-player__play-icon" />
		</div>
	)
	return (
		<div style={styles.preview} className="react-player__preview">
			{defaultPlayIcon}
		</div>
	)
}

function VideoEmbed({
	className,
	percentPlayedCallback = () => null,
	percentPlayedMilestones,
	start,
	url,
	...reactPlayerProps
}: VideoEmbedInnerProps) {
	/**
	 * Playback tracking is for analytics purposes.
	 */
	const [
		playState,
		{ setEnded, setDuration, setPosition, setPlaying, setStopped },
	] = usePlayState()
	// Note: not using secondsWatched for now, but it's ready for use.
	// const secondsWatched = useSecondsWatched(playState)
	const segmentsPlayed = useSegmentsPlayed(
		playState,
		PROGRESS_INTERVAL,
		MAX_PLAYBACK_SPEED
	)
	const videoPercentMilestone = useMilestones(
		segmentsPlayed.percent,
		percentPlayedMilestones
	)

	/**
	 * When we reach a new percent watched milestone,
	 * fire a callback to update on video progress.
	 */
	useEffect(() => {
		if (videoPercentMilestone !== null) {
			percentPlayedCallback(videoPercentMilestone)
		}
	}, [videoPercentMilestone, percentPlayedCallback])

	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		if (isMounted) {
			return
		}
		setIsMounted(true)
	}, [isMounted])

	//  propagating aliased `start` prop down to the actual player config
	const config = start
		? {
				youtube: {
					playerVars: {
						start,
					},
				},
				wistia: {
					options: { time: start },
				},
		  }
		: {}

	return (
		<div className={classNames(s.playerWrapper, className)}>
			{isMounted ? (
				<ReactPlayer
					{...reactPlayerProps}
					config={config}
					url={url}
					onDuration={setDuration}
					progressInterval={PROGRESS_INTERVAL}
					onProgress={({ playedSeconds }: { playedSeconds: number }) => {
						setPosition(playedSeconds)
					}}
					onEnded={setEnded}
					onPlay={setPlaying}
					onPause={setStopped}
					className={s.reactPlayer}
					width="100%"
					height="100%"
					controls
				/>
			) : (
				<VideoEmbedPlaceholder imageUrl={reactPlayerProps.light} />
			)}
		</div>
	)
}

/**
 * Wraps VideoEmbed with analytics, using the percentPlayedCallback.
 * PERCENT_MILESTONES is specified in "analytics/spec/events/video_played.yml".
 */
const PERCENT_MILESTONES = [1, 25, 50, 75, 90]
function VideoEmbedWithAnalytics({ url, ...restProps }: VideoEmbedProps) {
	/**
	 * We need our videoUrl to be a string for analytics purposes.
	 * react-player supports other types, but we can't use them as easily.
	 */
	if (typeof url !== 'string') {
		throw new Error(
			`VideoEmbed URL must be a string. Found type "${typeof url}". While other formats for this prop may be supported by react-player, they are not supported by our VideoEmbed component. Please ensure the "url" prop is a string.`
		)
	}

	return (
		<VideoEmbed
			{...restProps}
			url={url}
			percentPlayedMilestones={PERCENT_MILESTONES}
			percentPlayedCallback={(percentPlayed: number) => {
				videoPlayedEvent({ video_url: url, video_progress: percentPlayed })
			}}
		/>
	)
}

// Export the component with analytics
export default VideoEmbedWithAnalytics
