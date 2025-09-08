/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths, GetStaticProps } from 'next'
import { useCallback } from 'react'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import { toast, ToastColor } from 'components/toast'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'
import {
	CardTitle,
	CardDescription,
	CardFooter,
} from 'components/card/components'
import Card from 'components/card'
import CardsGridList from 'components/cards-grid-list'
import { BrandedHeaderCard } from 'views/product-integrations-landing/components/branded-header-card'
import { ProductSlug } from 'types/products'
import { SandboxLab } from 'types/sandbox'
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json' assert { type: 'json' }
import ProductIcon from 'components/product-icon'
import { serialize } from 'lib/next-mdx-remote/serialize'
import DevDotContent from 'components/dev-dot-content'
import getDocsMdxComponents from 'views/docs-view/utils/get-docs-mdx-components'
import { SidebarProps } from 'components/sidebar'
import Tabs, { Tab } from 'components/tabs'
import { buildLabIdWithConfig } from 'lib/build-instruqt-url'
import fs from 'fs'
import path from 'path'
import s from './sandbox.module.css'
import docsViewStyles from 'views/docs-view/docs-view.module.css'
import classNames from 'classnames'

/**
 * Tracks sandbox page errors with PostHog and development logging
 */
function trackSandboxPageError(
	errorType: string,
	errorMessage: string,
	context?: Record<string, unknown>
) {
	// Track error in PostHog for production monitoring
	if (typeof window !== 'undefined' && window.posthog?.capture) {
		window.posthog.capture('sandbox_page_error', {
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

interface SandboxPageProps {
	product: (typeof PRODUCT_DATA_MAP)[keyof typeof PRODUCT_DATA_MAP]
	layoutProps: {
		breadcrumbLinks: { title: string; url: string }[]
		navLevels: SidebarProps[]
	}
	availableSandboxes: SandboxLab[]
	otherSandboxes: SandboxLab[]
}

// Helper function to read and serialize MDX content
async function getMdxContent(
	filePath: string | undefined,
	productSlug: ProductSlug
) {
	if (!filePath) return null

	try {
		const fullPath = path.join(
			process.cwd(),
			'src/content/sandbox/docs',
			filePath
		)

		// Check if file exists before trying to read it
		try {
			await fs.promises.access(fullPath, fs.constants.F_OK)
		} catch {
			// Track missing documentation files for monitoring
			if (process.env.NODE_ENV === 'development') {
				console.warn(`[SandboxPage] MDX file not found: ${filePath}`)
			}
			return null
		}

		const fileContent = await fs.promises.readFile(fullPath, 'utf8')
		return await serialize(fileContent, {
			mdxOptions: {
				remarkPlugins: [],
				rehypePlugins: [],
			},
			scope: {
				product: productSlug,
			},
		})
	} catch (error) {
		// Track MDX processing errors for debugging
		if (process.env.NODE_ENV === 'development') {
			console.error(`[SandboxPage] Error reading MDX file ${filePath}:`, error)
		}
		return null
	}
}

export default function SandboxView({
	product,
	layoutProps,
	availableSandboxes,
	otherSandboxes,
}: SandboxPageProps) {
	const { openLab, hasConfigError } = useInstruqtEmbed()
	const docsMdxComponents = getDocsMdxComponents(product.slug)

	const handleLabClick = useCallback(
		(lab: SandboxLab) => {
			try {
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

				// Use the pre-built full lab ID that includes tokens and parameters
				const completeLabId = lab.fullLabId || lab.labId

				if (!completeLabId) {
					trackSandboxPageError(
						'missing_lab_id',
						'Lab ID is missing or invalid',
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

				openLab(completeLabId)
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
		[openLab, hasConfigError, product.slug]
	)

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
					<CardsGridList>
						{availableSandboxes.map((lab) => (
							<div key={`sandbox-${lab.labId}`}>
								<div className={s.sandboxCard}>
									<Card>
										<div className={s.cardHeader}>
											<CardTitle text={lab.title} />
											<div className={s.productIcons}>
												{lab.products.map((productSlug) => (
													<ProductIcon
														key={`product-${lab.labId}-${productSlug}`}
														productSlug={productSlug as ProductSlug}
														size={16}
														className={s.productIcon}
													/>
												))}
											</div>
										</div>
										<CardDescription text={lab.description} />
										<CardFooter>
											<button
												className={s.launchButton}
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													handleLabClick(lab)
												}}
											>
												Launch Sandbox
											</button>
										</CardFooter>
									</Card>
								</div>
							</div>
						))}
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

					<CardsGridList>
						{otherSandboxes.map((lab) => (
							<div key={lab.labId} className={s.sandboxCard}>
								<Card>
									<div className={s.cardHeader}>
										<CardTitle text={lab.title} />
										<div className={s.productIcons}>
											{lab.products.map((productSlug) => (
												<ProductIcon
													key={`${lab.labId}-${productSlug}`}
													productSlug={productSlug as ProductSlug}
													size={16}
													className={s.productIcon}
												/>
											))}
										</div>
									</div>
									<CardDescription text={lab.description} />
									<CardFooter>
										<button
											className={s.launchButton}
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
												handleLabClick(lab)
											}}
										>
											Launch Sandbox
										</button>
									</CardFooter>
								</Card>
							</div>
						))}
					</CardsGridList>
				</>
			)}
		</SidebarSidecarLayout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	const supportedProducts = SANDBOX_CONFIG.products || []

	const paths = supportedProducts
		.filter((productSlug) => PRODUCT_DATA_MAP[productSlug])
		.map((productSlug) => ({
			params: { productSlug },
		}))

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps<SandboxPageProps> = async ({
	params,
}) => {
	try {
		const productSlug = params?.productSlug as string
		const product = PRODUCT_DATA_MAP[productSlug]
		const supportedProducts = SANDBOX_CONFIG?.products || []

		if (!product || !supportedProducts.includes(productSlug)) {
			return {
				notFound: true,
			}
		}

		// Safely access the labs configuration
		const labs = SANDBOX_CONFIG?.labs || []

		// Process available sandboxes and their documentation
		const availableSandboxes = await Promise.all(
			labs
				.filter((lab) => lab?.products?.includes?.(productSlug))
				.map(async (lab) => {
					try {
						const {
							title,
							description,
							products,
							labId,
							instruqtTrack,
							scenario,
							documentation,
						} = lab
						const fullLabId = buildLabIdWithConfig(lab)

						const result: Partial<SandboxLab> = {
							title,
							description,
							products,
							labId,
							instruqtTrack,
							fullLabId,
						}

						// Only include scenario if it exists
						if (scenario) {
							result.scenario = scenario
						}

						if (documentation) {
							// Handle the MDX file with proper error handling
							try {
								result.documentation = await getMdxContent(
									documentation,
									productSlug as ProductSlug
								)
							} catch (mdxError) {
								// Track error but continue without documentation
								trackSandboxPageError(
									'documentation_load_failed',
									'Failed to load lab documentation during build',
									{
										lab_id: labId,
										product_slug: productSlug,
										documentation_path: documentation,
										error_message:
											mdxError instanceof Error
												? mdxError.message
												: String(mdxError),
									}
								)

								if (process.env.NODE_ENV === 'development') {
									console.warn(
										`Failed to load documentation for ${labId}:`,
										mdxError
									)
								}
								// Continue without documentation rather than failing the whole page
							}
						}

						return result as SandboxLab
					} catch (labError) {
						// Track lab processing error but continue with minimal version
						trackSandboxPageError(
							'lab_processing_failed',
							'Failed to process lab configuration during build',
							{
								lab_id: lab?.labId || 'unknown',
								product_slug: productSlug,
								error_message:
									labError instanceof Error
										? labError.message
										: String(labError),
							}
						)

						if (process.env.NODE_ENV === 'development') {
							console.error(`Error processing lab ${lab?.labId}:`, labError)
						}

						// Return a minimal version if there's an error
						return {
							title: lab?.title || 'Unknown Lab',
							description: lab?.description || 'Description not available',
							products: lab?.products || [productSlug],
							labId: lab?.labId || 'unknown',
							instruqtTrack: lab?.instruqtTrack || '',
							fullLabId: lab?.labId || 'unknown',
						} as SandboxLab
					}
				})
		)

		const otherSandboxes = labs
			.filter((lab) => lab?.products && !lab.products.includes(productSlug))
			.map((lab) => {
				try {
					const {
						title,
						description,
						products,
						labId,
						instruqtTrack,
						scenario,
					} = lab
					const fullLabId = buildLabIdWithConfig(lab)

					const result: Partial<SandboxLab> = {
						title,
						description,
						products,
						labId,
						instruqtTrack,
						fullLabId,
					}

					// Only include scenario if it exists
					if (scenario) {
						result.scenario = scenario
					}

					return result as SandboxLab
				} catch (labError) {
					// Track other lab processing error but continue with minimal version
					trackSandboxPageError(
						'other_lab_processing_failed',
						'Failed to process other lab configuration during build',
						{
							lab_id: lab?.labId || 'unknown',
							product_slug: productSlug,
							error_message:
								labError instanceof Error ? labError.message : String(labError),
						}
					)

					if (process.env.NODE_ENV === 'development') {
						console.error(`Error processing other lab ${lab?.labId}:`, labError)
					}

					// Return a minimal version if there's an error
					return {
						title: lab?.title || 'Unknown Lab',
						description: lab?.description || 'Description not available',
						products: lab?.products || [],
						labId: lab?.labId || 'unknown',
						instruqtTrack: lab?.instruqtTrack || '',
						fullLabId: lab?.labId || 'unknown',
					} as SandboxLab
				}
			})

		const breadcrumbLinks = [
			{ title: 'Developer', url: '/' },
			{ title: product.name, url: `/${productSlug}` },
			{ title: 'Sandbox', url: `/${productSlug}/sandbox` },
		]

		const sidebarNavDataLevels = [
			generateTopLevelSidebarNavData(product.name),
			generateProductLandingSidebarNavData(product),
		]

		const sandboxMenuItems = [
			{
				title: `${product.name} Sandbox`,
				fullPath: `/${productSlug}/sandbox`,
				path: `/${productSlug}/sandbox`,
				href: `/${productSlug}/sandbox`,
				theme: product.slug,
				isActive: true,
				id: 'sandbox',
			},
		]

		const sandboxLevel: SidebarProps = {
			backToLinkProps: {
				text: `${product.name} Home`,
				href: `/${product.slug}`,
			},
			title: 'Sandbox',
			menuItems: sandboxMenuItems,
			showFilterInput: false,
			visuallyHideTitle: true,
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
		}

		sidebarNavDataLevels.push(sandboxLevel)

		return {
			props: {
				product,
				layoutProps: {
					breadcrumbLinks,
					navLevels: sidebarNavDataLevels,
				},
				availableSandboxes,
				otherSandboxes,
			},
		}
	} catch (error) {
		// Track static props error
		trackSandboxPageError(
			'static_props_failed',
			'Failed to generate static props for sandbox page',
			{
				product_slug: params?.productSlug as string,
				error_message: error instanceof Error ? error.message : String(error),
			}
		)

		if (process.env.NODE_ENV === 'development') {
			console.error('Error in getStaticProps for sandbox page:', error)
		}

		// Return a minimal page rather than throwing an error during export
		const productSlug = params?.productSlug as string
		const product = PRODUCT_DATA_MAP[productSlug]

		if (product) {
			return {
				props: {
					product,
					layoutProps: {
						breadcrumbLinks: [
							{ title: 'Developer', url: '/' },
							{ title: product.name, url: `/${productSlug}` },
							{ title: 'Sandbox', url: `/${productSlug}/sandbox` },
						],
						navLevels: [
							generateTopLevelSidebarNavData(product.name),
							generateProductLandingSidebarNavData(product),
						],
					},
					availableSandboxes: [],
					otherSandboxes: [],
				},
			}
		}

		return {
			notFound: true,
		}
	}
}
