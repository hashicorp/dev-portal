import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import IconTileLogo from 'components/icon-tile-logo'
import Heading from 'components/heading'
import Text from 'components/text'
import { LandingHeroProps } from './types'
import s from './landing-hero.module.css'

const LandingHero = ({ pageHeading, pageSubtitle }: LandingHeroProps) => {
	const currentProduct = useCurrentProduct()

	const hasSubtitle = !!pageSubtitle

	return (
		<div
			className={classNames(
				s.root,
				{ [s.hasSubtitle]: hasSubtitle },
				'landing-hero'
			)}
		>
			<IconTileLogo
				productSlug={
					currentProduct.slug === 'sentinel' ? 'hcp' : currentProduct.slug
				}
				className={s.icon}
			/>
			<div>
				<Heading
					className={s.pageTitle}
					id={pageHeading.id}
					level={1}
					size={500}
					weight="bold"
				>
					{pageHeading.title}
				</Heading>
				{hasSubtitle ? (
					<Text className={s.pageSubtitle}>{pageSubtitle}</Text>
				) : null}
			</div>
		</div>
	)
}

export default LandingHero
