import Image from 'next/image'
import Link from 'next/link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
import { MdxCalloutProps, SolutionOption } from './types'
import s from './mdx-callout.module.css'
import patternInfrastructure from './img/infrastructure.png'
import patternNetworking from './img/networking.png'
import patternSecurity from './img/security.png'

const PATTERN_IMG_MAP: Record<SolutionOption, string> = {
	infrastructure: patternInfrastructure,
	networking: patternNetworking,
	security: patternSecurity,
}

export default function MdxCallout({
	product,
	solutionGroup,
}: // heading,
// subheading,
MdxCalloutProps) {
	return (
		<div
			className={s.root}
			style={
				{
					'--gradient': `var(--wpl-gradient-${solutionGroup}-horizontal)`,
				} as React.CSSProperties
			}
		>
			<div className={s.textContainer}>
				<Text asElement="p" weight="bold" color="var(--white)">
					Looking for <span className={s.solutionGradient}>{product}</span>{' '}
					documentation?
					{/* {heading} */}
				</Text>
				<Text
					asElement="p"
					size={200}
					color="var(--white)"
					className={s.subHeading}
				>
					To reference non-cloud documentation go to the {product} docs page.
					{/* {subHeading} */}
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
					src={PATTERN_IMG_MAP[solutionGroup]}
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
