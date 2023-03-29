import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import ProductIcon from 'components/product-icon'
import s from './chiclets.module.css'

const PRODUCT_SLUGS = [
	'hcp',
	'packer',
	'terraform',
	'consul',
	'boundary',
	'vault',
	'nomad',
	'waypoint',
	'vagrant',
]

const Chiclets = () => {
	return (
		<div className={s.root}>
			<p className={s.label} id="chiclets-nav-label">
				Explore by product
			</p>
			<nav aria-labelledby="chiclets-nav-label" className={s.nav}>
				<ul className={s.navList}>
					{PRODUCT_SLUGS.map((productSlug: ProductSlug) => {
						const href = `/${productSlug}`
						const text =
							productSlug === 'hcp' ? 'HCP' : productSlugsToNames[productSlug]
						return (
							<li key={productSlug}>
								<a className={s.navListLink} href={href}>
									<ProductIcon productSlug={productSlug} size={24} />
									{text}
								</a>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}

export { Chiclets }
