/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactPlayerProps } from 'react-player'

/**
 * For ReactPlayerProps documentation, see:
 * https://github.com/CookPete/react-player#props
 */
export interface VideoEmbedProps extends ReactPlayerProps {
	/**
	 * Optional string of classnames applied to the containing element.
	 */
	className?: string

	/**
	 * Optional starting time for the video. Works with YouTube and Wistia video URLS.
	 */
	start?: number

	/**
	 * URL for the video. Unlike in ReactPlayerProps, which has a flexible type,
	 * for our purposes, this must be a string
	 */
	url: string
}

/**
 * Inner component contains hooks for percent played,
 * we wrap this inner component to implement the analytics we want.
 */
export interface VideoEmbedInnerProps extends VideoEmbedProps {
	/**
	 * Callback fired when the % watched of the video changes,
	 * based on what percentage of timestamps have been played.
	 */

	percentPlayedCallback?: (percentPlayed: number) => void
	/**
	 * Optionally only call percentPlayedCallback when specific
	 * percentage milestones are reached
	 */
	percentPlayedMilestones?: number[]
}

/**
 * An object representing the video state,
 * used for progress tracking callbacks
 */
export interface PlayState {
	duration?: number
	isPlaying: boolean
	position: number
}
