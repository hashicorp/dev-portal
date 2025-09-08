/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRef, useEffect, useState, useCallback, memo } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import s from './embed-element.module.css'

interface EmbedState {
	isLoading: boolean
	hasError: boolean
	errorMessage: string
	retryCount: number
}

/**
 * EmbedElement component for displaying Instruqt lab environments
 *
 */
const EmbedElement = memo(function EmbedElement(): JSX.Element {
	const ref = useRef<HTMLIFrameElement>(null)
	const { active, labId } = useInstruqtEmbed()
	const router = useRouter()

	const [embedState, setEmbedState] = useState<EmbedState>({
		isLoading: true,
		hasError: false,
		errorMessage: '',
		retryCount: 0,
	})

	const resetEmbedState = useCallback(() => {
		setEmbedState({
			isLoading: true,
			hasError: false,
			errorMessage: '',
			retryCount: 0,
		})
	}, [])

	const handleIframeLoad = useCallback(() => {
		setEmbedState((prev) => ({
			...prev,
			isLoading: false,
			hasError: false,
		}))

		if (labId) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_LOADED, {
				labId,
				page: router.asPath,
			})
		}
	}, [labId, router.asPath])

	const handleIframeError = useCallback(() => {
		setEmbedState((prev) => ({
			...prev,
			isLoading: false,
			hasError: true,
			errorMessage:
				'Failed to load sandbox. Please check your internet connection and try again.',
		}))

		// Track error
		if (labId) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_ERROR, {
				labId,
				page: router.asPath,
				error: 'iframe_load_error',
				retryCount: embedState.retryCount,
			})
		}
	}, [labId, router.asPath, embedState.retryCount])

	const handleRetry = useCallback(() => {
		if (embedState.retryCount < 3) {
			setEmbedState((prev) => ({
				...prev,
				isLoading: true,
				hasError: false,
				errorMessage: '',
				retryCount: prev.retryCount + 1,
			}))

			if (labId) {
				trackSandboxEvent(SANDBOX_EVENT.SANDBOX_RETRY, {
					labId,
					page: router.asPath,
					retryCount: embedState.retryCount + 1,
				})
			}

			const iframe = ref.current
			if (iframe) {
				const expectedSrc = `https://play.instruqt.com/embed/${labId}`
				iframe.src = ''
				const timeoutId = setTimeout(() => {
					if (ref.current) {
						ref.current.src = expectedSrc
					}
				}, 100)

				return () => clearTimeout(timeoutId)
			}
		} else {
			setEmbedState((prev) => ({
				...prev,
				errorMessage:
					'Maximum retry attempts reached. Please refresh the page or try again later.',
			}))
		}
	}, [embedState.retryCount, labId, router.asPath])

	// Reset state when labId changes
	useEffect(() => {
		if (labId) {
			resetEmbedState()
		}
	}, [labId, resetEmbedState])

	useEffect(() => {
		if (!labId || !ref.current) {
			return
		}

		const iframe = ref.current
		const expectedSrc = `https://play.instruqt.com/embed/${labId}`

		if (iframe.src !== expectedSrc) {
			iframe.src = expectedSrc
		}
	}, [labId])

	useEffect(() => {
		if (!embedState.isLoading || !labId) {
			return
		}

		const timeoutId = setTimeout(() => {
			setEmbedState((current) => {
				if (current.isLoading) {
					return {
						...current,
						isLoading: false,
						hasError: true,
						errorMessage:
							'Failed to load sandbox. Please check your internet connection and try again.',
					}
				}
				return current
			})
		}, 30000)

		return () => clearTimeout(timeoutId)
	}, [embedState.isLoading, labId])

	useEffect(() => {
		const iframe = ref.current
		if (!iframe || !active) {
			return
		}

		iframe.focus()
	}, [active])

	if (!labId) {
		return (
			<div
				className={classNames(s.errorContainer, s.fullHeight)}
				role="status"
				aria-live="polite"
			>
				<div className={s.errorContent}>
					<h3>No Lab Selected</h3>
					<p>Please select a lab from the sandbox menu to get started.</p>
				</div>
			</div>
		)
	}

	return (
		<div className={classNames(s.embedContainer, { [s.hide]: !active })}>
			<div
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
				role="status"
			>
				{embedState.isLoading && 'Loading sandbox environment'}
				{embedState.hasError &&
					`Error loading sandbox: ${embedState.errorMessage}`}
				{!embedState.isLoading &&
					!embedState.hasError &&
					labId &&
					'Sandbox environment loaded successfully'}
			</div>

			{embedState.isLoading && (
				<div
					className={s.loadingContainer}
					role="status"
					aria-label="Loading sandbox"
				>
					<div className={s.loadingSpinner} aria-hidden="true" />
					<div className={s.loadingText}>
						<h3>Loading your sandbox...</h3>
						<p>This may take a few moments</p>
					</div>
				</div>
			)}

			{embedState.hasError && (
				<div className={s.errorContainer} role="alert" aria-live="assertive">
					<div className={s.errorContent}>
						<h3>Unable to Load Sandbox</h3>
						<p>{embedState.errorMessage}</p>
						{embedState.retryCount < 3 && (
							<button
								className={s.retryButton}
								onClick={handleRetry}
								type="button"
								aria-describedby="retry-description"
							>
								Try Again
							</button>
						)}
						<div id="retry-description" className="sr-only">
							Retry loading the sandbox environment
						</div>
					</div>
				</div>
			)}

			{labId && (
				<iframe
					ref={ref}
					title={`Instruqt Lab Environment: ${labId}`}
					width="100%"
					height="100%"
					sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
					src=""
					style={{
						height: 'inherit',
						opacity: embedState.isLoading || embedState.hasError ? 0 : 1,
						transition: 'opacity 0.2s ease',
					}}
					className={s.baseEmbedElement}
					onLoad={handleIframeLoad}
					onError={handleIframeError}
					referrerPolicy="strict-origin-when-cross-origin"
					loading="lazy"
					aria-label={`Interactive lab environment for ${labId}`}
					aria-live="polite"
					aria-busy={embedState.isLoading}
					allow="fullscreen"
				/>
			)}
		</div>
	)
})

export default EmbedElement
