// HashiCorp imports
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'

// Global imports
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import BaseNewLayout from 'layouts/base-new'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import StandaloneLink, {
	StandaloneLinkContents,
} from 'components/standalone-link'
import { GlobalThemeOption } from 'styles/themes/types'

// Local imports
import {
	PAGE_TITLE,
	PAGE_SUBTITLE,
	PRODUCT_DESCRIPTIONS,
	BADGE_ICON_MAP,
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
	BETTER_TOGETHER_SECTION_COLLECTION_SLUGS,
} from './constants'
import s from './tutorials-landing.module.css'

const ProductSection = ({
	certification,
	featuredCollections,
	featuredUseCases,
	productSlug,
	productTutorialsLandingCta,
	tutorialsLibraryCta,
}: $TSFixMe) => {
	return (
		<section className={s.section}>
			<div className={s.leftRight}>
				<div className={s.left}>
					<h2 className={s.sectionTitle}>
						<ProductIcon productSlug={productSlug} size={24} />
						<span>{productSlugsToNames[productSlug]}</span>
					</h2>
					<p className={s.sectionDescription}>
						{PRODUCT_DESCRIPTIONS[productSlug]}
					</p>
					<ul className={s.generalCtasList}>
						<li>
							<StandaloneLink
								color="secondary"
								href={productTutorialsLandingCta.href}
								icon={<IconArrowRight24 />}
								iconPosition="trailing"
								size="large"
								text={productTutorialsLandingCta.text}
							/>
						</li>
						<li>
							<StandaloneLink
								color="secondary"
								href={tutorialsLibraryCta.href}
								icon={<IconArrowRight24 />}
								iconPosition="trailing"
								size="large"
								text={tutorialsLibraryCta.text}
							/>
						</li>
					</ul>
					<h3 className={s.featuredUseCasesTitle}>Featured use cases</h3>
					<ul className={s.featuredUseCasesList}>
						{featuredUseCases.map(({ href, text }: $TSFixMe, index: number) => {
							return (
								// eslint-disable-next-line react/no-array-index-key
								<li key={`featured-use-case-${index}`}>
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
					<div className={s.grid}>
						{featuredCollections.map(
							({
								href,
								title,
								description,
								tutorialCount,
								badges,
							}: $TSFixMe) => {
								return (
									<div className={s.card} key={href}>
										<div className={s.cardHeader}>
											{title ? <h3 className={s.cardTitle}>{title}</h3> : null}
										</div>
										<div className={s.cardBody}>
											<div className={s.cardBodyLeftRight}>
												<div className={s.cardText}>
													<div className={s.cardEyebrow}>
														Learning path &#x2022; {tutorialCount ?? 'XX'}{' '}
														Tutorials
													</div>
													<p className={s.cardDescription}>{description}</p>
												</div>
												{/* <div className={s.fakeBookmarkButton}>
													<IconBookmarkAdd24 />
												</div> */}
											</div>
											<div className={s.cardBadges}>
												{badges.map(({ icon, label }: $TSFixMe) => (
													<Badge
														ariaLabel={label}
														icon={icon}
														key={`featured-collection-${href}-badge-${label}`}
														size="small"
													/>
												))}
											</div>
										</div>
									</div>
								)
							}
						)}
						{certification ? (
							<div className={s.certificationCard}>
								<div className={s.certificationCardEyebrow}>
									<span>
										Learning path &#x2022;
										{` ${certification.tutorialsCount} tutorial${
											certification.tutorialsCount > 1 ? 's' : ''
										}`}
									</span>
								</div>
								<h3 className={s.certificationCardTitle}>
									{certification.title}
								</h3>
								<p className={s.certificationCardBody}>
									{certification.description}
								</p>
								<StandaloneLinkContents
									icon={<IconArrowRight16 />}
									iconPosition="trailing"
									text="Get Certified"
									color="secondary"
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	)
}

const renderProductSections = (productSlugs, pageContent) => {
	return productSlugs.map((productSlug: ProductSlug) => {
		const productName = productSlugsToNames[productSlug]
		const sectionData = pageContent[productSlug]
		const featuredUseCases = sectionData.featuredUseCases
		const featuredCollections = sectionData.featuredCollections.map(
			(featuredCollection) => ({
				...featuredCollection,
				badges: featuredCollection.badges.map((badge) => BADGE_ICON_MAP[badge]),
			})
		)

		return (
			<ProductSection
				key={productSlug}
				productSlug={productSlug}
				productTutorialsLandingCta={{
					href: `/${productSlug}/tutorials`,
					text: `Explore more ${productName} learning paths`,
				}}
				tutorialsLibraryCta={{
					href: `/tutorials/library?product=${productSlug}`,
					text: `Search all ${productName} tutorials`,
				}}
				featuredUseCases={featuredUseCases}
				featuredCollections={featuredCollections}
			/>
		)
	})
}

const ContentTypesSection = () => {
	return (
		<section
			className={s.contentTypesSection}
			style={{ paddingTop: 80, paddingBottom: 80 }}
		>
			<div className={s.contentTypesSectionTextWrapper}>
				<h2
					className={s.contentTypesTitle}
					style={{
						marginTop: 0,
						marginBottom: 42,
						fontSize: '1.875rem',
						fontWeight: 700,
						lineHeight: '1.27',
						maxWidth: '60%',
					}}
				>
					{CONTENT_TYPES_SECTION_TITLE}
				</h2>
				<ul
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						gap: 48,
						listStyle: 'none',
						padding: 0,
						margin: 0,
					}}
				>
					{CONTENT_TYPES_SECTION_ITEMS.map(
						({ imageSource, title, description }) => {
							return (
								<li
									key={title}
									style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}
								>
									<img alt="" src={imageSource} />
									<div>
										<h3
											style={{
												marginTop: 0,
												marginBottom: 8,
												fontSize: '1.5rem',
												fontWeight: 600,
												lineHeight: '1.3',
											}}
										>
											{title}
										</h3>
										<p
											style={{
												fontSize: '1rem',
												fontWeight: 600,
												lineHeight: '1.5',
												color: '#656A76',
												margin: 0,
											}}
										>
											{description}
										</p>
									</div>
								</li>
							)
						}
					)}
				</ul>
			</div>
		</section>
	)
}

const BetterTogetherSection = () => {
	return (
		<section className={s.betterTogetherSection}>
			<h2
				style={{
					fontSize: '1.875rem',
					fontWeight: 700,
					lineHeight: '1.3',
					maxWidth: '40%',
					marginBottom: 36,
				}}
			>
				{BETTER_TOGETHER_SECTION_TITLE}
			</h2>
			<ul
				style={{
					margin: 0,
					padding: 0,
					display: 'flex',
					gap: 22,
					alignItems: 'flex-start',
					listStyle: 'none',
				}}
			>
				{BETTER_TOGETHER_SECTION_COLLECTION_SLUGS.map((collectionSlug) => {
					return (
						<li
							key={collectionSlug}
							style={{
								backgroundColor: '#DBDBDC',
								border: '1px solid magenta',
								width: 400,
								height: 300,
								borderRadius: 10,
								padding: 24,
							}}
						>
							{collectionSlug}
						</li>
					)
				})}
			</ul>
		</section>
	)
}

const TutorialsLandingView = ({ pageContent }: $TSFixMe) => {
	const productSlugKeys = Object.keys(pageContent)
	const [
		firstProductSlug,
		secondProductSlug,
		thirdProductSlug,
		...remainingProductSlugs
	] = productSlugKeys

	return (
		<div className={s.root}>
			<div className={s.hero}>
				<header className={s.header}>
					<h1 className={s.title}>{PAGE_TITLE}</h1>
					<p className={s.subtitle}>{PAGE_SUBTITLE}</p>
				</header>
			</div>
			{renderProductSections(
				[firstProductSlug, secondProductSlug, thirdProductSlug],
				pageContent
			)}
			<ContentTypesSection />
			{renderProductSections(remainingProductSlugs, pageContent)}
			<BetterTogetherSection />
		</div>
	)
}

TutorialsLandingView.contentType = 'tutorials'
TutorialsLandingView.layout = BaseNewLayout
TutorialsLandingView.theme = GlobalThemeOption.light

export default TutorialsLandingView
