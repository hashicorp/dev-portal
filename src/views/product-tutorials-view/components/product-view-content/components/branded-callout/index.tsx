import BrandedCard from 'components/branded-card'
import StandaloneLink from 'components/standalone-link'
import { BrandedCalloutProps } from './types'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
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
				<h2 className={s.heading}>{heading}</h2>
				{subheading ? <p className={s.subheading}>{subheading}</p> : null}
				<div className={s.cta}>
					<StandaloneLink
						text={cta.text}
						href={cta.url}
						icon={<IconArrowRight16 />}
						iconPosition="trailing"
						color="secondary"
						opensInNewTab={isExternal}
					/>
				</div>
			</div>
		</BrandedCard>
	)
}

export type { BrandedCalloutProps }
export { BrandedCallout }
