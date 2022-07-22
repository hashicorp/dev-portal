import LandingHero from 'components/landing-hero'
import { ProductRootDocsPathLandingIconCardLinkGrid } from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'

const ProductRootDocsPathLandingHero = ({
	pageHeading,
	pageSubtitle,
}: ProductRootDocsPathLandingHeroProps) => {
	return (
		<div className={s.root}>
			<LandingHero pageHeading={pageHeading} pageSubtitle={pageSubtitle} />
			<ProductRootDocsPathLandingIconCardLinkGrid />
		</div>
	)
}

export default ProductRootDocsPathLandingHero
