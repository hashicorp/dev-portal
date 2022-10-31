import NextSteps from '@hashicorp/react-next-steps'
import type { NextStepsProps } from '@hashicorp/react-next-steps/types'
import { Products } from '@hashicorp/platform-product-meta'
import s from './style.module.css'

interface CTA {
	heading: string
	description: string
	cta: string
	link: string
}

interface IoHomePreFooterProps {
	brand: Products
	heading: string
	description: string
	ctas: [CTA] | [CTA, CTA] | [CTA, CTA, CTA]
}

export default function IoHomePreFooter({
	brand,
	heading,
	description,
	ctas,
}: IoHomePreFooterProps) {
	return (
		<div className={s.ioHomePreFooter}>
			<NextSteps
				theme={brand}
				heading={heading}
				description={description}
				steps={
					ctas.map((cta: CTA) => {
						return {
							heading: cta.heading,
							description: cta.description,
							cta: {
								title: cta.cta,
								url: cta.link,
							},
						}
					}) as NextStepsProps['steps']
				}
			/>
		</div>
	)
}
