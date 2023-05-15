// HashiCorp imports
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { IconBoundaryColor16 } from '@hashicorp/flight-icons/svg-react/boundary-color-16'
import { IconConsulColor16 } from '@hashicorp/flight-icons/svg-react/consul-color-16'
import { IconNomadColor16 } from '@hashicorp/flight-icons/svg-react/nomad-color-16'
import { IconPackerColor16 } from '@hashicorp/flight-icons/svg-react/packer-color-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { IconTerraformColor16 } from '@hashicorp/flight-icons/svg-react/terraform-color-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'

// Global imports
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import BaseNewLayout from 'layouts/base-new'
import Badge from 'components/badge'
import StandaloneLink, {
	StandaloneLinkContents,
} from 'components/standalone-link'
import { GlobalThemeOption } from 'styles/themes/types'

// Local imports
import testData from './content.json'
import s from './tutorials-landing.module.css'

// Constants
const TITLE = 'Start here'
const SUBTITLE =
	'Brief intro - this is our opportunity to shape the value of this page for our Beginner practitioners. Max character count of 150 would be ideal.  Discover step-by-step learning paths to help you complete essential task to get started with HashiCorp products.'
const ICON_MAP = {
	vault: {
		icon: <IconVaultColor16 />,
		label: 'Vault',
	},
	consul: {
		icon: <IconConsulColor16 />,
		label: 'Consul',
	},
	terraform: {
		icon: <IconTerraformColor16 />,
		label: 'Terraform',
	},
	nomad: {
		icon: <IconNomadColor16 />,
		label: 'Nomad',
	},
	boundary: {
		icon: <IconBoundaryColor16 />,
		label: 'Boundary',
	},
	packer: {
		icon: <IconPackerColor16 />,
		label: 'Packer',
	},
	vagrant: {
		icon: <IconVagrantColor16 />,
		label: 'Vagrant',
	},
	waypoint: {
		icon: <IconWaypointColor16 />,
		label: 'Waypoint',
	},
	video: {
		icon: <IconPlay16 />,
		label: 'Video',
	},
	interactive: {
		icon: <IconTerminalScreen16 />,
		label: 'Interactive',
	},
}
const DEFAULT_BADGES = Object.values(ICON_MAP)

const ProductSection = ({
	title,
	description,
	productTutorialsLandingCta,
	tutorialsLibraryCta,
	featuredUseCases,
	featuredCollections,
	certification,
}: $TSFixMe) => {
	return (
		<section className={s.section}>
			<div className={s.leftRight}>
				<div className={s.left}>
					<h2 className={s.sectionTitle}>{title}</h2>
					<p className={s.sectionDescription}>{description}</p>
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

const TutorialsLandingView = () => {
	return (
		<div className={s.root}>
			<div className={s.hero}>
				<header className={s.header}>
					<h1 className={s.title}>{TITLE}</h1>
					<p className={s.subtitle}>{SUBTITLE}</p>
				</header>
			</div>
			{Object.keys(testData).map((productSlug: ProductSlug) => {
				const productName = productSlugsToNames[productSlug]
				const sectionData = testData[productSlug]
				const featuredUseCases = sectionData.featuredUseCases ?? [
					{ href: '#', text: 'Featured use case #1' },
					{ href: '#', text: 'Featured use case #2' },
					{ href: '#', text: 'Featured use case #3' },
				]
				const featuredCollections = sectionData.featuredCollections
					? sectionData.featuredCollections.map((featuredCollection) => ({
							...featuredCollection,
							badges: featuredCollection.badges.map((badge) => ICON_MAP[badge]),
					  }))
					: [
							{
								badges: DEFAULT_BADGES,
								href: '#',
								title: 'Install Product',
								description:
									'Brief description to gives the user enough context to take the next step with confidence',
								tutorialCount: 'XX',
							},
							{
								badges: DEFAULT_BADGES,
								href: '#',
								title: 'Build infrastructure',
								description:
									'Brief description to gives the user enough context to take the next step with confidence',
								tutorialCount: 'XX',
							},
							{
								badges: DEFAULT_BADGES,
								href: '#',
								title: 'Change infrastructure',
								description:
									'Brief description to gives the user enough context to take the next step with confidence',
								tutorialCount: 'XX',
							},
					  ]

				return (
					<ProductSection
						key={productSlug}
						title={sectionData.title}
						description={sectionData.description}
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
			})}
		</div>
	)
}

TutorialsLandingView.contentType = 'tutorials'
TutorialsLandingView.layout = BaseNewLayout
TutorialsLandingView.theme = GlobalThemeOption.light

export default TutorialsLandingView
