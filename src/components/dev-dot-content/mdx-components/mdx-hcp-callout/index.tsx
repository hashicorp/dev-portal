import Image from 'next/image'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import { HcpProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { HCPCalloutProps, SolutionOption } from './types'
import patternApplications from './img/applications.png'
import patternInfrastructure from './img/infrastructure.png'
import patternNetworking from './img/networking.png'
import patternSecurity from './img/security.png'
import s from './mdx-callout.module.css'

const SOLUTION_PRODUCTS_MAP: Record<SolutionOption, HcpProductSlug[]> = {
	applications: ['waypoint'],
	infrastructure: ['packer'],
	networking: ['consul'],
	security: ['boundary', 'vault'],
}

const SOLUTION_DETAILS: Record<
	SolutionOption,
	{
		gradient: string
		image: string
	}
> = {
	applications: {
		gradient: '--wpl-gradient-applications-horizontal',
		image: patternApplications,
	},
	infrastructure: {
		gradient: '--wpl-gradient-infrastructure-horizontal',
		image: patternInfrastructure,
	},
	networking: {
		gradient: '--wpl-gradient-networking-horizontal',
		image: patternNetworking,
	},
	security: {
		gradient: '--wpl-gradient-security-horizontal',
		image: patternSecurity,
	},
}

export default function HCPCallout({ product }: HCPCalloutProps) {
	const productName = productSlugsToNames[product]
	const solution = Object.keys(SOLUTION_PRODUCTS_MAP).find(
		(group: SolutionOption) => SOLUTION_PRODUCTS_MAP[group].includes(product)
	)
	const { gradient, image } = SOLUTION_DETAILS[solution]

	return (
		<div
			className={s.root}
			style={
				{
					'--gradient': `var(${gradient})`,
				} as React.CSSProperties
			}
		>
			<div className={s.textContainer}>
				<Text
					asElement="p"
					weight="bold"
					color="var(--white)"
					className={s.heading}
				>
					Looking for <span className={s.solutionGradient}>{productName}</span>{' '}
					fundamentals?
				</Text>
				<Text
					asElement="p"
					size={200}
					color="var(--white)"
					className={s.subHeading}
				>
					Read core {productName} documentation and tutorials, including
					self-hosted open source docs.
				</Text>
				<StandaloneLink
					text={`Go to ${productName}`}
					href={`/${product}/docs`}
					icon={<IconArrowRight16 color="var(--white)" className={s.ctaIcon} />}
					iconPosition="trailing"
					className={s.ctaWrapper}
				/>
			</div>
			<div className={s.solutionPattern}>
				<Image
					src={image}
					/** Note: pattern image is purely decorative */
					alt=""
					layout="fill"
					objectFit="cover"
					objectPosition="center"
				/>
			</div>
		</div>
	)
}
