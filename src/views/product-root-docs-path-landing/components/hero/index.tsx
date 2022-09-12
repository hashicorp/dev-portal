import LandingHero from 'components/landing-hero'
import { useCurrentProduct } from 'contexts'
import { ProductRootDocsPathLandingIconCardLinkGrid } from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'
import DocsVersionSwitcher from 'components/docs-version-switcher'

const ProductRootDocsPathLandingHero = ({
	pageHeading,
	pageSubtitle,
	versions,
}: ProductRootDocsPathLandingHeroProps) => {
	const currentProduct = useCurrentProduct()

	return (
		<header>
			<div className={versions ? s.heroWithVersionSwitcher : null}>
				{versions ? (
					<div className={s.versionSwitcherWrapper}>
						<DocsVersionSwitcher options={versions} />
					</div>
				) : null}
				<LandingHero pageHeading={pageHeading} pageSubtitle={pageSubtitle} />
			</div>
			{currentProduct.slug !== 'terraform' ? (
				<div className={s.iconCardGridLink}>
					<ProductRootDocsPathLandingIconCardLinkGrid />
				</div>
			) : null}
		</header>
	)
}

export default ProductRootDocsPathLandingHero
