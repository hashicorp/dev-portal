/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import { toast, ToastColor } from 'components/toast'
import CardsGridList, {
	TutorialCardsGridList,
} from 'components/cards-grid-list'
import SandboxCard from 'components/sandbox-card'
import { SandboxLab } from 'types/sandbox'
import { ProductOption } from 'lib/learn-client/types'
import { BrandedHeaderCard } from 'views/product-integrations-landing/components/branded-header-card'
import DevDotContent from 'components/dev-dot-content'
import getDocsMdxComponents from 'views/docs-view/utils/get-docs-mdx-components'
import Tabs, { Tab } from 'components/tabs'
import { ErrorBoundary } from 'react-error-boundary'
import s from './sandbox-view.module.css'
import docsViewStyles from 'views/docs-view/docs-view.module.css'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import { SidebarProps } from '@components/sidebar'
import posthog from 'posthog-js'

interface SandboxPageProps {
	product: (typeof PRODUCT_DATA_MAP)[keyof typeof PRODUCT_DATA_MAP]
	layoutProps: {
		breadcrumbLinks: { title: string; url: string }[]
		navLevels: SidebarProps[]
	}
	availableSandboxes: SandboxLab[]
	otherSandboxes: SandboxLab[]
}

const trackSandboxPageError = (
	errorType: string,
	errorMessage: string,
	context?: Record<string, unknown>
) => {
	if (typeof window !== 'undefined' && posthog?.capture) {
		posthog.capture('sandbox_page_error', {
			error_type: errorType,
			error_message: errorMessage,
			timestamp: new Date().toISOString(),
			page_url: window.location.href,
			...context,
		})
	}

	if (process.env.NODE_ENV === 'development') {
		console.error(`[SandboxPage] ${errorMessage}`, context)
	}
}

export const SandboxView = ({
	product,
	layoutProps,
	availableSandboxes,
	otherSandboxes,
}: SandboxPageProps) => {
	const router = useRouter()
	const { openLab, setActive, hasConfigError } = useInstruqtEmbed()
	const docsMdxComponents = getDocsMdxComponents(product.slug)

	const handleLabClick = useCallback(
		(lab: SandboxLab) => {
			try {
				const primaryProduct = lab.products[0]
				if (primaryProduct !== product.slug) {
					// Redirect to the lab's primary product sandbox page with auto-launch
					const targetUrl = `/${primaryProduct}/sandbox?launch=${lab.labId}`

					trackSandboxEvent(SANDBOX_EVENT.SANDBOX_STARTED, {
						labId: lab.labId,
						page: targetUrl,
					})

					router.push(targetUrl)
					return
				}

				if (hasConfigError) {
					trackSandboxPageError(
						'config_error_lab_launch',
						'Cannot launch lab due to configuration error',
						{
							lab_id: lab.labId,
							lab_title: lab.title,
						}
					)

					toast({
						title: 'Sandbox Configuration Error',
						description:
							'There was an issue with the sandbox configuration. Please refresh the page or try again later.',
						color: ToastColor.critical,
						autoDismiss: 8000,
					})
					return
				}

				if (!openLab) {
					trackSandboxPageError(
						'open_lab_function_missing',
						'openLab function is not available',
						{
							lab_id: lab.labId,
							lab_title: lab.title,
						}
					)

					toast({
						title: 'Sandbox Unavailable',
						description:
							'The sandbox system is temporarily unavailable. Please refresh the page and try again.',
						color: ToastColor.critical,
						autoDismiss: 8000,
					})
					return
				}

				const embedLabId = lab.instruqtTrack

				if (!embedLabId) {
					trackSandboxPageError(
						'missing_lab_id',
						'Lab embed ID is missing or invalid',
						{
							lab_id: lab.labId,
							lab_title: lab.title,
							full_lab_id: lab.fullLabId,
						}
					)

					toast({
						title: 'Unable to Launch Sandbox',
						description: `Unable to launch "${lab.title}". This lab may be temporarily unavailable.`,
						color: ToastColor.critical,
						autoDismiss: 8000,
					})
					return
				}

				openLab(embedLabId)
				setActive(true)

				trackSandboxEvent(SANDBOX_EVENT.SANDBOX_STARTED, {
					labId: lab.labId,
					page: `/${product.slug}/sandbox`,
				})
			} catch (error) {
				trackSandboxPageError(
					'lab_launch_exception',
					'Unexpected error launching sandbox',
					{
						lab_id: lab.labId,
						lab_title: lab.title,
						error_message:
							error instanceof Error ? error.message : String(error),
					}
				)

				toast({
					title: 'Launch Error',
					description:
						'An unexpected error occurred while launching the sandbox. Please try again.',
					color: ToastColor.critical,
					autoDismiss: 8000,
				})
			}
		},
		[openLab, setActive, hasConfigError, product.slug, router]
	)

	useEffect(() => {
		const { launch, embed } = router.query

		const launchParam = launch || embed

		if (launchParam && typeof launchParam === 'string') {
			let labToLaunch: SandboxLab | undefined

			// First try to find by simple labId (for 'launch' parameter)
			labToLaunch = availableSandboxes.find((lab) => lab.labId === launchParam)

			// If not found, try to match by instruqt track path (for 'embed' parameter)
			if (!labToLaunch) {
				// Extract the base track name from full instruqt path
				// e.g., "hashicorp-learn/tracks/nomad-sandbox?token=..." -> "nomad-sandbox"
				let baseTrackName = launchParam

				// Remove query parameters first
				baseTrackName = baseTrackName.split('?')[0]

				// Extract track name from path
				if (baseTrackName.includes('/tracks/')) {
					baseTrackName = baseTrackName.split('/tracks/')[1]
				}

				// Find lab by matching the track name part of instruqtTrack
				labToLaunch = availableSandboxes.find((lab) =>
					lab.instruqtTrack?.includes(`/tracks/${baseTrackName}`)
				)
			}

			if (labToLaunch) {
				// Clear the query parameter to avoid infinite loops
				const newUrl = router.asPath.split('?')[0]
				router.replace(newUrl, undefined, { shallow: true })

				// Auto-launch the lab
				handleLabClick(labToLaunch)
			}
		}
	}, [router.query.launch, availableSandboxes, handleLabClick, router])

	const renderDocumentation = (documentation?: SandboxLab['documentation']) => {
		if (!documentation) return null

		try {
			return (
				<div className={classNames(s.mdxContent, docsViewStyles.mdxContent)}>
					<DevDotContent
						mdxRemoteProps={{
							compiledSource: documentation.compiledSource,
							scope: documentation.scope,
							components: docsMdxComponents,
						}}
					/>
				</div>
			)
		} catch (error) {
			trackSandboxPageError(
				'documentation_render_failed',
				'Failed to render sandbox documentation',
				{
					error_message: error instanceof Error ? error.message : String(error),
					has_compiled_source: !!documentation.compiledSource,
					has_scope: !!documentation.scope,
				}
			)

			return (
				<div className={s.mdxContent}>
					<p>Documentation temporarily unavailable.</p>
				</div>
			)
		}
	}

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.navLevels}
		>
			<BrandedHeaderCard
				productSlug={product.slug}
				heading={`${product.name} Interactive Sandboxes`}
				description="Experiment with HashiCorp products in a safe, pre-configured environment."
			/>

			<div className={s.sandboxIntro}>
				<p className={s.introText}>
					HashiCorp Sandboxes provide interactive environments where you can
					experiment with HashiCorp products without any installation or setup.
					They&apos;re perfect for:
				</p>

				<ul className={s.featureList}>
					<li>Learning how products work in a real environment</li>
					<li>
						Testing configurations and commands without affecting your systems
					</li>
					<li>Exploring product features in a safe sandbox</li>
					<li>Following along with tutorials and documentation</li>
				</ul>

				<p className={s.introText}>
					Each sandbox comes pre-configured with everything you need to start
					using the product immediately. Just click on a sandbox below to launch
					it in your browser.
				</p>
			</div>

			<h2 className={s.sectionHeading}>Available {product.name} sandboxes</h2>

			<p className={s.helpText}>
				When you launch a sandbox, you&apos;ll be presented with a terminal
				interface where you can interact with the pre-configured environment.
				The sandbox runs in your browser and doesn&apos;t require any downloads
				or installations.
			</p>
			<p className={s.helpText}>
				Each sandbox session lasts for up to 1 hour, giving you plenty of time
				to experiment. Your work isn&apos;t saved between sessions, so be sure
				to copy any important configurations before your session ends.
			</p>

			{availableSandboxes.length > 0 ? (
				<>
					<CardsGridList gridGap="8px">
						{availableSandboxes.map((lab) => {
							return (
								<SandboxCard
									key={`sandbox-${lab.labId}`}
									title={lab.title}
									description={lab.description}
									labId={lab.labId}
									products={lab.products}
									onLaunch={() => handleLabClick(lab)}
								/>
							)
						})}
					</CardsGridList>

					<h2 className={s.sectionHeading}>Sandbox documentation</h2>

					{availableSandboxes.some((lab) => lab.documentation) && (
						<Tabs ariaLabel="Sandbox Documentation Tabs">
							{availableSandboxes.map((lab) => (
								<Tab key={lab.labId} heading={lab.title}>
									{lab.documentation ? (
										renderDocumentation(lab.documentation)
									) : (
										<p className={s.noDocumentation}>
											No documentation is available for this sandbox.
										</p>
									)}
								</Tab>
							))}
						</Tabs>
					)}
				</>
			) : (
				<p className={s.noSandboxes}>
					There are currently no sandboxes available for {product.name}. Check
					back later or explore other product sandboxes.
				</p>
			)}

			{otherSandboxes.length > 0 && (
				<>
					<h2 className={s.sectionHeading}>Other sandboxes</h2>
					<p className={s.introText}>
						Explore sandboxes for other HashiCorp products that you might find
						useful.
					</p>

					<ErrorBoundary
						FallbackComponent={({ error }) => (
							<div className={s.errorMessage}>
								<p>Error loading other sandboxes: {error.message}</p>
							</div>
						)}
					>
						<TutorialCardsGridList
							compact={true}
							gridGap="8px"
							fixedColumns={2}
							tutorials={otherSandboxes.map((lab) => {
								const isSameProduct = lab.products[0] === product.slug
								const url = isSameProduct
									? '#'
									: `/${lab.products[0]}/sandbox?launch=${encodeURIComponent(
											lab.labId
									  )}`
								if (isSameProduct) {
									return {
										id: lab.labId,
										collectionId: null,
										description: lab.description,
										duration: 'Interactive Sandbox',
										hasInteractiveLab: true,
										hasVideo: false,
										heading: lab.title,
										url,
										productsUsed: lab.products as ProductOption[],
										onClick: (e: React.MouseEvent) => {
											e.preventDefault()
											handleLabClick(lab)
										},
									}
								}
								return {
									id: lab.labId,
									collectionId: null,
									description: lab.description,
									duration: 'Interactive Sandbox',
									hasInteractiveLab: true,
									hasVideo: false,
									heading: lab.title,
									url,
									productsUsed: lab.products as ProductOption[],
								}
							})}
							className={s.sandboxGrid}
						/>
					</ErrorBoundary>
				</>
			)}
		</SidebarSidecarLayout>
	)
}
