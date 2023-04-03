/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { productSlugs } from 'lib/products'
import { GlobalThemeOption } from 'styles/themes/types'
import BaseNewLayout from 'layouts/base-new'
import Text from 'components/text'

// Local imports
import { HomePageProps, HomePageContentProps } from './types'
import {
	Chiclets,
	FeaturedContentGrid,
	PageTitle,
	PreFooter,
} from './components'
import ProductNav from './components/product-nav'
import MerchandisingSlots from './components/merchandising-slots'
import { HeroWithVideo } from './components/hero'
import { HcpSlot, VaultSlot } from './components/merchandising-slots/slots'
import { CertificationsSection } from './components/certifications-section'
import s from './homepage.module.css'

const HOME_PAGE_REDESIGN_ENABLED = __config.flags.enable_home_page_redesign
const VIDEO_URL = 'https://hashicorp.wistia.com/medias/m17a0rrzj1'
const VIDEO_THUMBNAIL_URL =
	'https://embed-ssl.wistia.com/deliveries/86999d82bb41a2c3674f0ebb6f4b55ad442d556c.jpg?image_crop_resized=960x560'

const HomePageContent = ({
	hero,
	merchandising,
	certificationsSection,
	preFooter,
	navNotice,
}: HomePageContentProps) => {
	const products = useMemo(
		() =>
			productSlugs
				.filter((slug) => slug !== 'sentinel')
				.map((slug) => ({
					slug,
				})),
		[]
	)

	return (
		<div className={s.homepageContent}>
			<HeroWithVideo
				heading={hero.heading}
				description={<Text>{hero.description}</Text>}
				videoUrl={VIDEO_URL}
				videoImageUrl={VIDEO_THUMBNAIL_URL}
			/>
			<ProductNav notice={navNotice} products={products} />
			<MerchandisingSlots>
				<VaultSlot
					url={merchandising.vault.url}
					cardTitle={merchandising.vault.cardTitle}
					description={merchandising.vault.description}
					ctaText={merchandising.vault.ctaText}
				/>
				<HcpSlot
					url={merchandising.hcp.url}
					cardTitle={merchandising.hcp.cardTitle}
					description={merchandising.hcp.description}
					ctaText={merchandising.hcp.ctaText}
				/>
			</MerchandisingSlots>
			<CertificationsSection
				heading={certificationsSection.heading}
				description={certificationsSection.description}
				collectionCards={certificationsSection.collectionCards}
				link={certificationsSection.link}
			/>
			<PreFooter
				heading={preFooter.heading}
				description={preFooter.description}
				actions={preFooter.actions}
			/>
		</div>
	)
}

const RedesignedHomePageContent = () => {
	return (
		<div className={s.root}>
			<div className={s.background} />
			<div className={s.limitedWidthContainer}>
				<PageTitle />
				<Chiclets />
				<FeaturedContentGrid />
				<PreFooter
					heading="Looking for help?"
					description="We offer paid support, a free forum, and other community resources."
					actions={[
						{
							icon: 'support',
							heading: 'Support',
							description: 'Open a support ticket',
							link: 'https://support.hashicorp.com/hc/en-us',
						},
						{
							icon: 'help',
							heading: 'Forum',
							description: 'Find your answer on the forum',
							link: 'https://discuss.hashicorp.com/',
						},
						{
							icon: 'user',
							heading: 'Community',
							description: 'Join our community',
							link: 'https://www.hashicorp.com/community',
						},
					]}
				/>
			</div>
		</div>
	)
}

function HomePageView({ content }: HomePageProps): ReactElement {
	if (HOME_PAGE_REDESIGN_ENABLED) {
		return <RedesignedHomePageContent />
	}

	return (
		<div className={s.homepage}>
			<HomePageContent {...content} />
		</div>
	)
}

/**
 * `contentType` is set to "tutorials" so that all of the featured Search
 * options will show the Tutorials tab by default. If we decide to feature
 * Search terms that should show other tabs on click, then CommandBar will need
 * to have functionality added to do so.
 */
HomePageView.contentType = 'tutorials'
HomePageView.layout = BaseNewLayout
HomePageView.theme = GlobalThemeOption.light

export default HomePageView
