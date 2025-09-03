import { useEffect, useState } from 'react'
import classNames from 'classnames'
import WistiaPlayer from 'react-player/wistia'
import Player from 'react-player'
import s from './style.module.css'

interface InlineVideoProps {
	appearance?: 'light' | 'dark'
	url: string
	description?: string
	solution?: 'infrastructure' | 'security' | 'networking' | 'applications'
	gradientPosition?: 'left' | 'right' | false
	videoClassName?: string
	aspectRatio?: string
	showAccent?: boolean
}

const DEFAULT_ASPECT_RATIO = '16 / 9'

const InlineVideo = (props: InlineVideoProps) => {
	const {
		appearance = 'light',
		gradientPosition = 'left',
		url,
		description,
		solution,
		videoClassName,
		aspectRatio,
		showAccent = true,
	} = props

	const hasAspectRatio = Boolean(aspectRatio)

	const playerProps = {
		controls: true,
		url,
		width: '100%',
		height: '100%',
	}

	const [hasWindow, setHasWindow] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true)
		}
	}, [])

	return (
		<div
			className={classNames(
				s.inlineVideo,
				s[appearance],
				gradientPosition && s[gradientPosition]
			)}
			data-testid="wpl-inline-video"
		>
			<div
				className={classNames(s.videoContainer, solution && s[solution], {
					[s.hideAccentColor]: !showAccent,
				})}
				style={{
					['--aspect-ratio' as string]: hasAspectRatio
						? aspectRatio
						: DEFAULT_ASPECT_RATIO,
				}}
			>
				<div
					className={classNames(
						s.video,
						{
							[s.innerHasAspectRatio]: hasAspectRatio,
						},
						videoClassName
					)}
				>
					{hasWindow ? (
						<>
							{url.includes('wistia') ? (
								<WistiaPlayer
									{...playerProps}
									config={{
										options: {
											controlsVisibleOnLoad: false,
										},
									}}
								/>
							) : (
								<Player {...playerProps} />
							)}
						</>
					) : null}
				</div>
			</div>

			{description ? <p className={s.description}>{description}</p> : null}
		</div>
	)
}

export type { InlineVideoProps }
export { InlineVideo }
