import LandingHero from 'components/landing-hero'
import { useCurrentProduct } from 'contexts'
import { ProductRootDocsPathLandingIconCardLinkGrid } from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'

const ProductRootDocsPathLandingHero = ({
	pageHeading,
	pageSubtitle,
}: ProductRootDocsPathLandingHeroProps) => {
	const currentProduct = useCurrentProduct()

	return (
		<header className={s.root}>
			<LandingHero pageHeading={pageHeading} pageSubtitle={pageSubtitle} />
			{currentProduct.slug !== 'terraform' ? (
				<div className={s.iconCardGridLink}>
					<ProductRootDocsPathLandingIconCardLinkGrid />
				</div>
			) : null}
		</header>
	)
}

export default ProductRootDocsPathLandingHero
