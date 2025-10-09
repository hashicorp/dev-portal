/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths, GetStaticProps } from 'next'
import path from 'path'
import fs from 'fs'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'
import { ProductSlug } from 'types/products'
import { SandboxLab } from 'types/sandbox'
import { serialize } from 'lib/next-mdx-remote/serialize'
import { SidebarProps } from 'components/sidebar'
import { buildLabIdWithConfig } from 'lib/build-instruqt-url'
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json' assert { type: 'json' }
import posthog from 'posthog-js'
import { SandboxView } from 'views/sandbox-view'

/**
 * Tracks sandbox page errors with PostHog and development logging
 */
const trackSandboxPageError = (
	errorType: string,
	errorMessage: string,
	context?: Record<string, unknown>
) => {
	// Track error in PostHog for production monitoring
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

		try {
			await fs.promises.access(fullPath, fs.constants.F_OK)
		} catch {
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
							try {
								result.documentation = await getMdxContent(
									documentation,
									productSlug as ProductSlug
								)
							} catch (mdxError) {
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

export default SandboxView
