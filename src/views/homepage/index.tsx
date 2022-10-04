// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { productSlugs } from 'lib/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import BaseNewLayout from 'layouts/base-new'
import Text from 'components/text'

// Local imports
import { HomePageProps, HomePageContentProps } from './types'
import PreFooter from './components/pre-footer'
import ProductNav from './components/product-nav'
import LearnSection from './components/learn-section'
import MerchandisingSlots from './components/merchandising-slots'
import { HeroWithVideo } from './components/hero'
import {
	HashiConfGlobalSlot,
	VaultSlot,
} from './components/merchandising-slots/slots'
import s from './homepage.module.css'

const VIDEO_URL = 'https://hashicorp.wistia.com/medias/wa3pabhjc0'
const VIDEO_THUMBNAIL_URL =
	'https://embed-ssl.wistia.com/deliveries/24c4cd16a0b5c100490d61038575eddf5b5f186a.jpg?image_crop_resized=960x560'

const HomePageContent = ({
	hero,
	merchandising,
	learnSection,
	preFooter,
	navNotice,
}: HomePageContentProps) => {
	const products = useMemo(
		() =>
			productSlugs
				.filter((slug) => slug !== 'sentinel')
				.map((slug) => ({
					slug,
					isBeta: getIsBetaProduct(slug),
				})),
		[]
	)

	return (
		<div className={s.homepageContent}>
			<HeroWithVideo
				badgeText={hero.badgeText}
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
				<HashiConfGlobalSlot
					description={merchandising.hashiconfGlobal.description}
				/>
			</MerchandisingSlots>
			<LearnSection
				imageSrc={learnSection.imageSrc}
				heading={learnSection.heading}
				description={learnSection.description}
				collectionCards={learnSection.collectionCards}
				link={learnSection.link}
			/>
			<PreFooter
				heading={preFooter.heading}
				description={preFooter.description}
				actions={preFooter.actions}
			/>
		</div>
	)
}

function HomePageView({ content }: HomePageProps): ReactElement {
	return (
		<div className={s.homepage}>
			<HomePageContent {...content} />
		</div>
	)
}

HomePageView.layout = BaseNewLayout
export default HomePageView
