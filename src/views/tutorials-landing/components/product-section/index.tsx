import classNames from 'classnames'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { ProductName, ProductSlug } from 'types/products'
import {
	trackFeaturedUseCaseLinkClicked,
	trackProductTutorialsLandingLinkClicked,
	trackTutorialLibraryLinkClicked,
} from 'views/tutorials-landing/analytics'
import ProductIcon from 'components/product-icon'
import StandaloneLink from 'components/standalone-link'
import CollectionContentCardLink from 'components/tutorials-landing-view/collection-content-card-link'
import CertificationContentCardLink from 'components/tutorials-landing-view/certification-content-card-link'
import {
	CertificationContentCardLinkProps,
	CollectionContentCardLinkProps,
} from 'components/tutorials-landing-view/types'
import s from './product-section.module.css'

type Certification = CertificationContentCardLinkProps['certification']
type Collection = CollectionContentCardLinkProps['collection']
interface FeaturedUseCase {
	href: string
	text: string
}

interface ProductSectionProps {
	certification: Certification
	className?: string
	featuredCollections: Collection[]
	featuredUseCases: FeaturedUseCase[]
	product: {
		slug: ProductSlug
		name: ProductName
		description: string
	}
}

const GeneralCtasList = ({ product }) => {
	const { name, slug } = product
	const productTutorialsLandingHref = `/${slug}/tutorials`
	const tutorialLibraryHref = `/tutorials/library?product=${slug}`

	return (
		<ul className={s.generalCtasList}>
			<li>
				<StandaloneLink
					color="secondary"
					href={productTutorialsLandingHref}
					icon={<IconArrowRight24 />}
					iconPosition="trailing"
					size="large"
					text={`Explore more ${name} learning paths`}
					onClick={() => {
						trackProductTutorialsLandingLinkClicked({
							linkPath: productTutorialsLandingHref,
							productSlug: product.slug,
						})
					}}
				/>
			</li>
			<li>
				<StandaloneLink
					color="secondary"
					href={tutorialLibraryHref}
					icon={<IconArrowRight24 />}
					iconPosition="trailing"
					size="large"
					text={`Browse all ${name} tutorials`}
					onClick={() => {
						trackTutorialLibraryLinkClicked({
							linkPath: tutorialLibraryHref,
							productSlug: product.slug,
						})
					}}
				/>
			</li>
		</ul>
	)
}

const FeaturedUseCasesList = ({ featuredUseCases, product }) => {
	return (
		<>
			<h3 className={s.featuredUseCasesTitle}>Featured use cases</h3>
			<ul className={s.featuredUseCasesList}>
				{featuredUseCases.map(({ href, text }: FeaturedUseCase) => {
					return (
						<li key={href}>
							<StandaloneLink
								color="secondary"
								href={href}
								icon={<IconArrowRight24 />}
								iconPosition="trailing"
								size="large"
								text={text}
								onClick={() => {
									trackFeaturedUseCaseLinkClicked({
										linkPath: href,
										productSlug: product.slug,
									})
								}}
							/>
						</li>
					)
				})}
			</ul>
		</>
	)
}

const CtasAndFeaturedUseCases = ({ product, featuredUseCases }) => {
	return (
		<>
			<GeneralCtasList product={product} />
			<hr className={s.separator} />
			<FeaturedUseCasesList
				featuredUseCases={featuredUseCases}
				product={product}
			/>
		</>
	)
}

const SectionTitle = ({ product }) => {
	const { name, slug } = product
	return (
		<div className={s.titleWrapper}>
			<ProductIcon productSlug={slug} size={24} />
			<h2 className={s.title}>{name}</h2>
		</div>
	)
}

const SectionDescription = ({ text }) => {
	return <p className={s.description}>{text}</p>
}

const MobileProductSection = ({
	certification,
	product,
	featuredCollections,
	featuredUseCases,
}) => {
	return (
		<div className="g-hide-on-desktop">
			<SectionTitle product={product} />
			<SectionDescription text={product.description} />
			<ul className={s.mobileFeaturedCollectionsList}>
				{featuredCollections.map((collection) => (
					<li key={collection.id}>
						<CollectionContentCardLink collection={collection} />
					</li>
				))}
			</ul>
			<div className={s.mobileCertificationCardAndCtas}>
				{certification ? (
					<div>
						<CertificationContentCardLink
							certification={certification}
							product={product}
						/>
					</div>
				) : null}
				<div className={s.mobileCtasAndFeaturedUseCases}>
					<CtasAndFeaturedUseCases
						product={product}
						featuredUseCases={featuredUseCases}
					/>
				</div>
			</div>
		</div>
	)
}

const NonMobileProductSection = ({
	certification,
	featuredCollections,
	featuredUseCases,
	product,
}) => {
	return (
		<div
			className={classNames(
				'g-hide-on-mobile',
				'g-hide-on-tablet',
				s.mobileRoot
			)}
		>
			<div>
				<SectionTitle product={product} />
				<SectionDescription text={product.description} />
				<CtasAndFeaturedUseCases
					product={product}
					featuredUseCases={featuredUseCases}
				/>
			</div>
			<ul className={s.grid}>
				{featuredCollections.map((collection: Collection) => (
					<li key={collection.slug}>
						<CollectionContentCardLink collection={collection} />
					</li>
				))}
				{certification ? (
					<li>
						<CertificationContentCardLink
							key={certification.slug}
							certification={certification}
							product={product}
						/>
					</li>
				) : null}
			</ul>
		</div>
	)
}

const ProductSection = ({
	certification,
	className,
	featuredCollections,
	featuredUseCases,
	product,
}: ProductSectionProps) => {
	return (
		<div className={classNames(s.root, className)}>
			<MobileProductSection
				certification={certification}
				product={product}
				featuredCollections={featuredCollections}
				featuredUseCases={featuredUseCases}
			/>
			<NonMobileProductSection
				certification={certification}
				product={product}
				featuredCollections={featuredCollections}
				featuredUseCases={featuredUseCases}
			/>
		</div>
	)
}

export { ProductSection }
