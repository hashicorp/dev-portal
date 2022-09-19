import Image from 'next/image'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import { HcpProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { MdxHcpCalloutProps, SolutionOption } from './types'
import patternInfrastructure from './img/infrastructure.png'
import patternNetworking from './img/networking.png'
import patternSecurity from './img/security.png'
import s from './mdx-callout.module.css'

const PATTERN_IMG_MAP: Record<SolutionOption, string> = {
	infrastructure: patternInfrastructure,
	networking: patternNetworking,
	security: patternSecurity,
}

const SOLUTION_MAP: Record<SolutionOption, HcpProductSlug[]> = {
	infrastructure: ['packer'],
	networking: ['consul'],
	security: ['boundary', 'vault'],
}

export default function MdxHcpCallout({ product }: MdxHcpCalloutProps) {
	const productName = productSlugsToNames[product]

	const solution = Object.keys(SOLUTION_MAP).find((group: SolutionOption) =>
		SOLUTION_MAP[group].includes(product)
	)

	return (
		<div
			className={s.root}
			style={
				{
					'--gradient': `var(--wpl-gradient-${solution}-horizontal)`,
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
					documentation?
				</Text>
				<Text
					asElement="p"
					size={200}
					color="var(--white)"
					className={s.subHeading}
				>
					To reference non-cloud documentation go to the {productName} docs
					page.
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
					src={PATTERN_IMG_MAP[solution]}
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
