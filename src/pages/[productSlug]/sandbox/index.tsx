/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths, GetStaticProps } from 'next'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
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
import { MenuItem } from 'components/sidebar/types'
import { ProductSlug } from 'types/products'
import SANDBOX_CONFIG from 'data/sandbox.json'
import ProductIcon from 'components/product-icon'
import s from './sandbox.module.css'

interface SandboxPageProps {
	product: (typeof PRODUCT_DATA_MAP)[keyof typeof PRODUCT_DATA_MAP]
	layoutProps: {
		breadcrumbLinks: { title: string; url: string }[]
		navLevels: any[]
	}
	availableSandboxes: {
		title: string
		description: string
		products: string[]
		labId: string
	}[]
	otherSandboxes: {
		title: string
		description: string
		products: string[]
		labId: string
	}[]
}

export default function SandboxView({
	product,
	layoutProps,
	availableSandboxes,
	otherSandboxes,
}: SandboxPageProps) {
	const { openLab } = useInstruqtEmbed()

	const handleLabClick = (labId: string) => {
		openLab(labId)
		trackSandboxEvent(SANDBOX_EVENT.SANDBOX_STARTED, {
			labId,
			page: `/${product.slug}/sandbox`,
		})
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
					They're perfect for:
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

			<h2 className={s.sectionHeading}>
				Available {product.name} sandboxes. Click to launch the sandbox.
			</h2>

			<p className={s.helpText}>
				When you launch a sandbox, you'll be presented with a terminal interface
				where you can interact with the pre-configured environment. The sandbox
				runs in your browser and doesn't require any downloads or installations.
			</p>
			<p className={s.helpText}>
				Each sandbox session lasts for up to 1 hour, giving you plenty of time
				to experiment. Your work isn't saved between sessions, so be sure to
				copy any important configurations before your session ends.
			</p>

			{availableSandboxes.length > 0 ? (
				<CardsGridList>
					{availableSandboxes.map((lab, index) => (
						<div
							key={index}
							className={s.sandboxCard}
							onClick={() => handleLabClick(lab.labId)}
						>
							<Card>
								<div className={s.cardHeader}>
									<CardTitle text={lab.title} />
									<div className={s.productIcons}>
										{lab.products.map((productSlug, idx) => (
											<ProductIcon
												key={idx}
												productSlug={productSlug as ProductSlug}
												size={16}
												className={s.productIcon}
											/>
										))}
									</div>
								</div>
								<CardDescription text={lab.description} />
								<CardFooter>
									<button className={s.launchButton}>Launch Sandbox</button>
								</CardFooter>
							</Card>
						</div>
					))}
				</CardsGridList>
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
						{otherSandboxes.map((lab, index) => (
							<div
								key={index}
								className={s.sandboxCard}
								onClick={() => handleLabClick(lab.labId)}
							>
								<Card>
									<div className={s.cardHeader}>
										<CardTitle text={lab.title} />
										<div className={s.productIcons}>
											{lab.products.map((productSlug, idx) => (
												<ProductIcon
													key={idx}
													productSlug={productSlug as ProductSlug}
													size={16}
													className={s.productIcon}
												/>
											))}
										</div>
									</div>
									<CardDescription text={lab.description} />
									<CardFooter>
										<button className={s.launchButton}>Launch Sandbox</button>
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
	// Get the list of supported products from sandbox.json
	const supportedProducts = SANDBOX_CONFIG.products || []

	// Generate paths for all products that are in the supported products list
	const paths = supportedProducts
		.filter((productSlug) => PRODUCT_DATA_MAP[productSlug]) // Ensure the product exists in PRODUCT_DATA_MAP
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
	const productSlug = params?.productSlug as string
	const product = PRODUCT_DATA_MAP[productSlug]
	const supportedProducts = SANDBOX_CONFIG.products || []

	// Only show sandbox page if product is in the supported products list
	if (!product || !supportedProducts.includes(productSlug)) {
		return {
			notFound: true,
		}
	}

	// Filter sandboxes that are relevant to this product
	const availableSandboxes = SANDBOX_CONFIG.labs.filter((lab) =>
		lab.products.includes(productSlug)
	)

	// Filter sandboxes that are NOT relevant to this product
	const otherSandboxes = SANDBOX_CONFIG.labs.filter(
		(lab) => !lab.products.includes(productSlug)
	)

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${productSlug}` },
		{ title: 'Sandbox', url: `/${productSlug}/sandbox` },
	]

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
	]

	// Add sandbox links
	const sandboxMenuItems: MenuItem[] = [
		{
			title: `${product.name} Sandbox`,
			fullPath: `/${productSlug}/sandbox`,
			theme: product.slug,
			isActive: true,
		},
	]

	sidebarNavDataLevels.push({
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
	})

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
}
