import * as React from 'react'
import Image from 'next/image'
import { Card as MDSCard } from '@hashicorp/react-mds/src/components/card'
import { Text } from '@hashicorp/react-mds/src/components/text'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { ProductBadge } from '@hashicorp/react-mds/src/patterns/product-badge'
import type {
	CardPrimitiveProps,
	ThumbnailProps,
	MetaProps,
	ContentProps,
	HeadingProps,
	ProductBadgesProps,
	DescriptionProps,
} from './types'
import s from './style.module.css'
import classNames from 'classnames'

const Card = React.forwardRef<HTMLDivElement, CardPrimitiveProps>(
	(props, ref) => {
		const {
			withArrow = true,
			link,
			clickHandler,
			isExternal,
			children,
			className,
			'aria-label': ariaLabel,
		} = props

		return (
			<MDSCard
				className={classNames(s.card, className)}
				href={link}
				onClickCapture={clickHandler}
				isExternal={isExternal}
				ref={ref}
				aria-label={ariaLabel}
			>
				{children}
				<div className={s.cta}>{withArrow ? <IconArrowRight24 /> : null}</div>
			</MDSCard>
		)
	}
)

Card.displayName = 'Card'

const Thumbnail = ({ src, alt }: ThumbnailProps) => {
	return (
		<div className={s.thumbnail} data-testid="wpl-card-thumbnail">
			<div className={s.image}>
				<Image src={src} alt={alt} width={800} height={450} />
			</div>
		</div>
	)
}

const PersonThumbnail = ({ src, alt }: ThumbnailProps) => {
	return (
		<div className={s.personThumbnail} data-testid="wpl-card-thumbnail">
			<div className={s.image}>
				<Image src={src} alt={alt} width={800} height={450} />
			</div>
		</div>
	)
}

const LogoThumbnail = ({ src, alt }: ThumbnailProps) => {
	return (
		<div className={s.logoThumbnail} data-testid="wpl-card-logo-thumbnail">
			<div className={s.image}>
				<Image src={src} alt={alt} width={800} height={450} />
			</div>
		</div>
	)
}

const Meta = ({ items }: MetaProps) => {
	return (
		<div className={s.meta} data-testid="wpl-card-meta">
			<Text.Label>
				{items.map((item, stableIdx) => {
					const isLastItem = stableIdx === items.length - 1
					return (
						<>
							{item}
							{!isLastItem ? (
								<span className={s.metaSeparator} aria-hidden={true}>
									|
								</span>
							) : null}
						</>
					)
				})}
			</Text.Label>
		</div>
	)
}

const Content = ({ children }: ContentProps) => {
	return (
		<div className={s.content} data-testid="wpl-card-content">
			{children}
		</div>
	)
}

const Heading = ({ as = 'h2', children }: HeadingProps) => {
	return (
		<Text.DisplayExpressive tag={as} size="200" className={s.heading}>
			{children}
		</Text.DisplayExpressive>
	)
}

const ProductBadges = ({ badges, children }: ProductBadgesProps) => {
	return (
		<div className={s.productBadges} data-testid="wpl-card-badges">
			{badges.map((badge, stableIdx) => {
				return (
					<ProductBadge
						// eslint-disable-next-line react/no-array-index-key
						key={`product-badge-${stableIdx}`}
						productName={badge}
						hasDot={true}
					/>
				)
			})}
			{children}
		</div>
	)
}

const Description = ({ children }: DescriptionProps) => {
	return (
		<Text.Body tag="p" size="200" className={s.description}>
			{children}
		</Text.Body>
	)
}

export {
	Card,
	Thumbnail,
	PersonThumbnail,
	LogoThumbnail,
	Meta,
	Content,
	Heading,
	Description,
	ProductBadges,
}
