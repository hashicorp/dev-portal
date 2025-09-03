import * as CardPrimitives from '../primitives'
import type { ThumbnailProps } from '../types'

interface PromoCardProps {
	heading: string
	description?: string
	eyebrow?: string
	link: string
	clickHandler?: () => void
	thumbnail?: ThumbnailProps
	withArrow?: boolean
	isExternal?: boolean
	className?: string
}

const PromoCard = ({
	heading,
	description,
	eyebrow,
	link,
	clickHandler,
	thumbnail,
	withArrow = false,
	isExternal = false,
	className,
}: PromoCardProps) => {
	return (
		<CardPrimitives.Card
			link={link}
			withArrow={withArrow}
			isExternal={isExternal}
			className={className}
			clickHandler={clickHandler}
			aria-label={heading}
		>
			{thumbnail ? <CardPrimitives.Thumbnail {...thumbnail} /> : null}
			<CardPrimitives.Content>
				{eyebrow ? <CardPrimitives.Meta items={[eyebrow]} /> : null}
				<CardPrimitives.Heading>{heading}</CardPrimitives.Heading>
				{description ? (
					<CardPrimitives.Description>{description}</CardPrimitives.Description>
				) : null}
			</CardPrimitives.Content>
		</CardPrimitives.Card>
	)
}

export type { PromoCardProps }
export { PromoCard }
