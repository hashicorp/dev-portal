import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { IconBoundaryColor16 } from '@hashicorp/flight-icons/svg-react/boundary-color-16'
import { IconConsulColor16 } from '@hashicorp/flight-icons/svg-react/consul-color-16'
import { IconNomadColor16 } from '@hashicorp/flight-icons/svg-react/nomad-color-16'
import { IconPackerColor16 } from '@hashicorp/flight-icons/svg-react/packer-color-16'
import { IconTerminal16 } from '@hashicorp/flight-icons/svg-react/terminal-16'
import { IconTerraformColor16 } from '@hashicorp/flight-icons/svg-react/terraform-color-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconVideo16 } from '@hashicorp/flight-icons/svg-react/video-16'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'
import BaseNewLayout from 'layouts/base-new'
import { GlobalThemeOption } from 'styles/themes/types'
import Badge from 'components/badge'
import StandaloneLink, {
	StandaloneLinkContents,
} from 'components/standalone-link'
import s from './tutorials-landing.module.css'
import { IconBookmarkAdd24 } from '@hashicorp/flight-icons/svg-react/bookmark-add-24'

const TITLE = 'Start here'
const SUBTITLE =
	'Brief intro - this is our opportunity to shape the value of this page for our Beginner practitioners. Max character count of 150 would be ideal.  Discover step-by-step learning paths to help you complete essential task to get started with HashiCorp products.'
const DEFAULT_BADGES = [
	{
		icon: <IconVaultColor16 />,
		label: 'Vault',
	},
	{
		icon: <IconConsulColor16 />,
		label: 'Consul',
	},
	{
		icon: <IconTerraformColor16 />,
		label: 'Terraform',
	},
	{
		icon: <IconNomadColor16 />,
		label: 'Nomad',
	},
	{
		icon: <IconBoundaryColor16 />,
		label: 'Boundary',
	},
	{
		icon: <IconPackerColor16 />,
		label: 'Packer',
	},
	{
		icon: <IconVagrantColor16 />,
		label: 'Vagrant',
	},
	{
		icon: <IconWaypointColor16 />,
		label: 'Waypoint',
	},
]

const ProductSection = ({
	description,
	title,
	featuredUseCases,
	featuredTutorials,
	certification,
}: $TSFixMe) => {
	return (
		<section className={s.section}>
			<div className={s.leftRight}>
				<div className={s.left}>
					<h2 className={s.sectionTitle}>{title}</h2>
					<p className={s.sectionDescription}>{description}</p>
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
						{featuredTutorials.map(
							({ href, title, description, length, badges }: $TSFixMe) => {
								return (
									<div className={s.card} key={href}>
										<div className={s.cardHeader}>
											{title ? <h3 className={s.cardTitle}>{title}</h3> : null}
										</div>
										<div className={s.cardBody}>
											<div className={s.cardBodyLeftRight}>
												<div className={s.cardText}>
													<div className={s.cardEyebrow}>
														Tutorial &#x2022; {length}
													</div>
													<p className={s.cardDescription}>{description}</p>
												</div>
												<div className={s.fakeBookmarkButton}>
													<IconBookmarkAdd24 />
												</div>
											</div>
											<div className={s.cardBadges}>
												{badges.map(({ icon, label }: $TSFixMe) => (
													<Badge
														ariaLabel={label}
														icon={icon}
														key={'ajsdlf'}
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
			<ProductSection
				title="Learn Terraform"
				description="Terraform is an infrastructure as code tool that lets you build, change, and version infrastructure safely and efficiently."
				featuredUseCases={[
					{
						href: '/terraform/tutorials/applications',
						text: 'Deploy and Monitor Applications',
					},
					{ href: '/terraform/tutorials/aws', text: 'Manage AWS Services' },
					{ href: '/terraform/tutorials/azure', text: 'Manage Azure Services' },
				]}
				featuredTutorials={[
					{
						href: '/terraform/tutorials/certification-associate-tutorials/infrastructure-as-code',
						title: 'What is Infrastructure as Code with Terraform?',
						description:
							'Learn how infrastructure as code lets you safely build, change, and manage infrastructure. Try Terraform.',
						length: '3 minutes',
						badges: [
							{
								icon: <IconTerraformColor16 />,
								label: 'Terraform',
							},
							{
								icon: <IconVideo16 />,
								label: 'Video',
							},
							{
								icon: <IconTerminal16 />,
								label: 'Interactive',
							},
						],
					},
					{
						href: '/terraform/tutorials/configuration-language/resource',
						title: 'Define Infrastructure with Terraform Resources',
						description:
							'Create an EC2 instance, then use the Terraform Registry to create a security group to make it publicly accessible. Learn how Terraform resources define infrastructure as code through arguments, attributes, and dependencies.',
						length: '11 minutes',
						badges: [
							{
								icon: <IconTerraformColor16 />,
								label: 'Terraform',
							},
							{
								icon: <IconVideo16 />,
								label: 'Video',
							},
						],
					},
					{
						href: '/terraform/tutorials/cloud-get-started/cloud-sign-up',
						title: 'What is Terraform Cloud?',
						description:
							'Sign up for Terraform Cloud, which provides free remote state storage, a stable run environment, version control system (VCS) driven plans and applies, a collaborative web GUI, and more. Create your first organization.',
						length: '5 minutes',
						badges: [
							{
								icon: <IconTerraformColor16 />,
								label: 'Terraform',
							},
						],
					},
				]}
				certification={{
					href: '/terraform/tutorials/certification-003',
					title: 'Prepare for Terraform Certification (003)',
					tutorialsCount: 2,
					description:
						'Prepare for the HashiCorp Certified: Terraform Associate (003) exam. These guides list the test objectives for the exam and the complete list of docs and tutorials to study.',
				}}
			/>
			{new Array(9).fill(null).map((_, index: number) => {
				return (
					<ProductSection
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						title={`Product ${index + 1}`}
						description="Brief product description: Learn how to provision, change, and version resources on any environment. Set expectations"
						featuredUseCases={[
							{ href: '#', text: 'Featured use case #1' },
							{ href: '#', text: 'Featured use case #2' },
							{ href: '#', text: 'Featured use case #3' },
						]}
						featuredTutorials={[
							{
								badges: DEFAULT_BADGES,
								href: '#',
								title: 'Install Product',
								description:
									'Brief description to gives the user enough context to take the next step with confidence',
								length: '6 minutes',
							},
							{
								badges: DEFAULT_BADGES,
								href: '#',
								title: 'Build infrastructure',
								description:
									'Brief description to gives the user enough context to take the next step with confidence',
								length: '6 minutes',
							},
							{
								badges: DEFAULT_BADGES,
								href: '#',
								title: 'Change infrastructure',
								description:
									'Brief description to gives the user enough context to take the next step with confidence',
								length: '6 minutes',
							},
						]}
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
