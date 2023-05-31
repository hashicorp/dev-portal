import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import ProductIcon from 'components/product-icon'
import StandaloneLink from 'components/standalone-link'
import s from './product-section.module.css'
import CollectionContentCardLink from 'components/tutorials-landing-view/collection-content-card-link'
import CertificationContentCardLink from 'components/tutorials-landing-view/certification-content-card-link'

const ProductSection = ({
	certification,
	featuredCollections,
	featuredUseCases,
	product,
}: $TSFixMe) => {
	const { slug, name, description } = product

	return (
		<div className={s.root}>
			<div className={s.left}>
				<h2 className={s.sectionTitle}>
					<ProductIcon productSlug={slug} size={24} />
					<span>{name}</span>
				</h2>
				<p className={s.sectionDescription}>{description}</p>
				<ul className={s.generalCtasList}>
					<li>
						<StandaloneLink
							color="secondary"
							href={`/${slug}/tutorials`}
							icon={<IconArrowRight24 />}
							iconPosition="trailing"
							size="large"
							text={`Explore more ${name} tutorials`}
						/>
					</li>
					<li>
						<StandaloneLink
							color="secondary"
							href={`/tutorials/library?product=${slug}`}
							icon={<IconArrowRight24 />}
							iconPosition="trailing"
							size="large"
							text={`Browse all ${name} tutorials`}
						/>
					</li>
				</ul>
				<h3 className={s.featuredUseCasesTitle}>Featured use cases</h3>
				<ul className={s.featuredUseCasesList}>
					{featuredUseCases.map(({ href, text }) => {
						return (
							<li key={href}>
								<StandaloneLink
									color="secondary"
									href={href}
									icon={<IconArrowRight24 />}
									iconPosition="trailing"
									size="large"
									text={text}
								/>
							</li>
						)
					})}
				</ul>
			</div>
			<div className={s.right}>
				<ul className={s.grid}>
					{featuredCollections.map((collection) => (
						<li key={collection.slug}>
							<CollectionContentCardLink collection={collection} />
						</li>
					))}
					{certification ? (
						<li>
							<CertificationContentCardLink
								key={certification.slug}
								certification={certification}
							/>
						</li>
					) : null}
				</ul>
			</div>
		</div>
	)
}

export { ProductSection }
