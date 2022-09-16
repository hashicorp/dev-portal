import Image from 'next/image'
import Link from 'next/link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Text from 'components/text'
import { HcpProductName } from 'types/products'
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

const SOLUTION_MAP: Record<SolutionOption, HcpProductName[]> = {
	infrastructure: ['Packer'],
	networking: ['Consul'],
	security: ['Boundary', 'Vault'],
}

export default function MdxHcpCallout({
	product = 'Vault',
}: MdxHcpCalloutProps) {
	const solution = Object.keys(SOLUTION_MAP).find((group: SolutionOption) =>
		SOLUTION_MAP[group].includes(product)
	)

	console.log(solution)

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
				<Text asElement="p" weight="bold" color="var(--white)">
					Looking for <span className={s.solutionGradient}>{product}</span>{' '}
					documentation?
				</Text>
				<Text
					asElement="p"
					size={200}
					color="var(--white)"
					className={s.subHeading}
				>
					To reference non-cloud documentation go to the {product} docs page.
				</Text>
				<div className={s.ctaWrapper}>
					<span className={s.ctaText}>{`Go to ${product}`}</span>
					<IconArrowRight16 color="var(--white)" />
				</div>
				{/* <StandaloneLink
					text={`Go to ${product}`}
					href={`/${product}/docs`}
					icon={<IconArrowRight16 color="var(--white)" />}
					iconPosition="trailing"
					textClassName={s.cta}
					className={s.ctaWrapper}
				/> */}
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
			<Link href={`/${product}/docs`}>
				{/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
				<a className={s.link} aria-label={`Go to ${product}`} />
			</Link>
		</div>
	)
}
