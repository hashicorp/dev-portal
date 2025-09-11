import Image, { type ImageProps } from 'next/image'
import { Badge } from '@hashicorp/react-mds/src/components/badge'
import { Text } from '@hashicorp/react-mds/src/components/text'
import * as CardPrimitives from '../primitives'
import type { CardProps } from '../types'
import s from './style.module.css'

interface PartnerCardProps {
	heading: string
	description: string
	meta: string[]
	link: string
	productBadges?: CardProps['productBadges']
	competencyBadges?: string[]
	logo: ImageProps
	className?: string
}

const PartnerCard = ({
	heading,
	description,
	meta,
	link,
	productBadges,
	competencyBadges,
	logo,
	className,
}: PartnerCardProps) => {
	const hasProductBadges = productBadges && productBadges.length > 0
	const hasCompetencyBadges = competencyBadges && competencyBadges.length > 0

	return (
		<CardPrimitives.Card
			link={link}
			withArrow={false}
			isExternal={false}
			className={className}
			aria-label={heading}
		>
			<div className={s.logoContainer}>
				<Image {...logo} alt={logo.alt} className={s.logo} />
			</div>
			<CardPrimitives.Content>
				<CardPrimitives.Meta items={meta} />
				<Text.Body tag="p" size="200" className={s.description}>
					{description}
				</Text.Body>
				{hasProductBadges || hasCompetencyBadges ? (
					<CardPrimitives.ProductBadges badges={productBadges || []}>
						{hasCompetencyBadges &&
							competencyBadges.map((competencyBadge, stableIdx) => (
								<Badge key={stableIdx} text={competencyBadge} icon="dot" />
							))}
					</CardPrimitives.ProductBadges>
				) : null}
			</CardPrimitives.Content>
		</CardPrimitives.Card>
	)
}

export type { PartnerCardProps }
export { PartnerCard }
