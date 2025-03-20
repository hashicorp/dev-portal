/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths, GetStaticProps } from 'next'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { trackPlaygroundEvent } from 'lib/analytics'
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
import PLAYGROUND_CONFIG from 'data/playground.json'
import ProductIcon from 'components/product-icon'
import s from './playground.module.css'

interface PlaygroundPageProps {
	product: (typeof PRODUCT_DATA_MAP)[keyof typeof PRODUCT_DATA_MAP]
	layoutProps: {
		breadcrumbLinks: { title: string; url: string }[]
		navLevels: any[]
	}
	availablePlaygrounds: {
		title: string
		description: string
		products: string[]
		labId: string
	}[]
	otherPlaygrounds: {
		title: string
		description: string
		products: string[]
		labId: string
	}[]
}

export default function PlaygroundView({
	product,
	layoutProps,
	availablePlaygrounds,
	otherPlaygrounds,
}: PlaygroundPageProps) {
	const { openLab } = useInstruqtEmbed()

	const handleLabClick = (labId: string) => {
		openLab(labId)
		trackPlaygroundEvent('playground_started', {
			labId,
			page: `/${product.slug}/playground`,
		})
	}

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.navLevels}
		>
			<BrandedHeaderCard
				productSlug={product.slug}
				heading={`${product.name} Interactive Playgrounds`}
				description="Experiment with HashiCorp products in a safe, pre-configured environment."
			/>

			<div className={s.playgroundIntro}>
				<p className={s.introText}>
					HashiCorp Playgrounds provide interactive environments where you can
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
					Each playground comes pre-configured with everything you need to start
					using the product immediately. Just click on a playground below to
					launch it in your browser.
				</p>

				{/* <div className={s.gettingStartedInfo}>
					<h3 className={s.subSectionHeading}>Getting Started</h3>
					<p className={s.helpText}>
						When you launch a playground, you'll be presented with a terminal interface where you can
						interact with the pre-configured environment. The playground runs in your browser and
						doesn't require any downloads or installations.
					</p>
					<p className={s.helpText}>
						Each playground session lasts for up to 1 hour, giving you plenty of time to experiment.
						Your work isn't saved between sessions, so be sure to copy any important configurations
						before your session ends.
					</p>
				</div> */}
			</div>

			<h2 className={s.sectionHeading}>Available {product.name} playgrounds</h2>

			<p className={s.helpText}>
				When you launch a playground, you'll be presented with a terminal
				interface where you can interact with the pre-configured environment.
				The playground runs in your browser and doesn't require any downloads or
				installations.
			</p>
			<p className={s.helpText}>
				Each playground session lasts for up to 1 hour, giving you plenty of
				time to experiment. Your work isn't saved between sessions, so be sure
				to copy any important configurations before your session ends.
			</p>

			{availablePlaygrounds.length > 0 ? (
				<CardsGridList>
					{availablePlaygrounds.map((lab, index) => (
						<div
							key={index}
							className={s.playgroundCard}
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
									<button className={s.launchButton}>Launch Playground</button>
								</CardFooter>
							</Card>
						</div>
					))}
				</CardsGridList>
			) : (
				<p className={s.noPlaygrounds}>
					There are currently no playgrounds available for {product.name}. Check
					back later or explore other product playgrounds.
				</p>
			)}

			{otherPlaygrounds.length > 0 && (
				<>
					<h2 className={s.sectionHeading}>Other playgrounds</h2>
					<p className={s.introText}>
						Explore playgrounds for other HashiCorp products that you might find
						useful.
					</p>

					<CardsGridList>
						{otherPlaygrounds.map((lab, index) => (
							<div
								key={index}
								className={s.playgroundCard}
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
										<button className={s.launchButton}>
											Launch Playground
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
	// Get the list of supported products from playground.json
	const supportedProducts = PLAYGROUND_CONFIG.products || []

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

export const getStaticProps: GetStaticProps<PlaygroundPageProps> = async ({
	params,
}) => {
	const productSlug = params?.productSlug as string
	const product = PRODUCT_DATA_MAP[productSlug]
	const supportedProducts = PLAYGROUND_CONFIG.products || []

	// Only show playground page if product is in the supported products list
	if (!product || !supportedProducts.includes(productSlug)) {
		return {
			notFound: true,
		}
	}

	// Filter playgrounds that are relevant to this product
	const availablePlaygrounds = PLAYGROUND_CONFIG.labs.filter((lab) =>
		lab.products.includes(productSlug)
	)

	// Filter playgrounds that are NOT relevant to this product
	const otherPlaygrounds = PLAYGROUND_CONFIG.labs.filter(
		(lab) => !lab.products.includes(productSlug)
	)

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${productSlug}` },
		{ title: 'Playground', url: `/${productSlug}/playground` },
	]

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
	]

	// Add playground links
	const playgroundMenuItems: MenuItem[] = [
		{
			title: `${product.name} Playground`,
			fullPath: `/${productSlug}/playground`,
			theme: product.slug,
			isActive: true,
		},
	]

	if (product.playgroundConfig?.sidebarLinks) {
		playgroundMenuItems.push(
			{ heading: 'Resources' },
			...product.playgroundConfig.sidebarLinks.map((link) => ({
				title: link.title,
				path: link.href,
				href: link.href,
				isActive: false,
			}))
		)
	}

	sidebarNavDataLevels.push({
		backToLinkProps: {
			text: `${product.name} Home`,
			href: `/${product.slug}`,
		},
		title: 'Playground',
		menuItems: playgroundMenuItems,
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
			availablePlaygrounds,
			otherPlaygrounds,
		},
	}
}
