import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import BrandedCard from 'components/branded-card'
import Heading from 'components/heading'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import { BrandedCalloutProps } from './types'
import s from './branded-callout.module.css'

function BrandedCallout({
	heading,
	subheading,
	cta,
	product,
}: BrandedCalloutProps) {
	/** Determine if the provided CTA link is external */
	const isExternal =
		typeof location !== 'undefined' &&
		cta.url.startsWith('http') &&
		!cta.url.startsWith(location.origin)

	return (
		<BrandedCard productSlug={product}>
			<div className={s.cardPadding}>
				<Heading className={s.heading} level={1} size={500} weight="bold">
					{heading}
				</Heading>
				{subheading ? (
					<Text
						asElement="p"
						className={s.subheading}
						size={300}
						weight="regular"
					>
						{subheading}
					</Text>
				) : null}
				<div className={s.cta}>
					<StandaloneLink
						text={cta.text}
						href={cta.url}
						icon={<IconArrowRight16 />}
						iconPosition="trailing"
						color="secondary"
						opensInNewTab={isExternal}
						size="small"
					/>
				</div>
			</div>
		</BrandedCard>
	)
}

export type { BrandedCalloutProps }
export { BrandedCallout }
