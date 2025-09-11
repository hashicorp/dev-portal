import { forwardRef, type PropsWithChildren } from 'react'
import type {
	CardContentProps,
	CardThumbnailProps,
	CardProps,
	CardCtaProps,
} from './types'
import Link from 'next/link'
import Image from 'next/image'
import { Text } from '../text'
import classNames from 'classnames'
import { Badge } from '../badge'
import { StandaloneLink } from '../standalone-link'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import s from './styles.module.css'

const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			children,
			className,
			content,
			ctaLabel,
			href,
			standaloneLink,
			isExternal,
			onClickCapture,
			'aria-label': ariaLabel,
		},
		ref
	) => {
		const isCardLink = href && !ctaLabel

		const linkProps = isExternal
			? { target: '_blank', rel: 'noopener noreferrer' }
			: {}

		return (
			<div
				ref={ref}
				className={classNames(
					s.card,
					{ [s.interactive]: isCardLink },
					className
				)}
			>
				{isCardLink && (
					<Link
						href={href}
						className={s.link}
						draggable="false"
						onClickCapture={onClickCapture}
						aria-label={ariaLabel}
						{...linkProps}
					/>
				)}
				{content && (
					<CardContent
						badges={content.badges}
						description={content.description}
						eyebrow={content.eyebrow}
						heading={content.heading}
						subheading={content.subheading}
						thumbnail={content.thumbnail}
						showArrow={content.showArrow && !!isCardLink}
						cta={{
							ctaLabel,
							href,
							standaloneLink,
							onClickCapture,
							isExternal,
						}}
					/>
				)}
				{children}
				{children && (
					<CardCta
						ctaLabel={ctaLabel}
						href={href}
						standaloneLink={standaloneLink}
						onClickCapture={onClickCapture}
						isExternal={isExternal}
					/>
				)}
			</div>
		)
	}
)

Card.displayName = 'Card'

const CardContent = ({
	badges,
	description,
	eyebrow,
	heading,
	thumbnail,
	subheading,
	cta,
	showArrow,
}: CardContentProps) => {
	return (
		<div className={classNames(s.content, { [s['has-thumbnail']]: thumbnail })}>
			{thumbnail && <CardThumbnail {...thumbnail} />}
			<div className={s.contentLockup}>
				<CardEyebrow>{eyebrow}</CardEyebrow>
				<CardHeading>{heading}</CardHeading>
				<CardSubheading>{subheading}</CardSubheading>
				<CardDescription>{description}</CardDescription>
				<Badges badges={badges} />
				{cta && (
					<CardCta
						ctaLabel={cta.ctaLabel}
						href={cta.href}
						standaloneLink={cta.standaloneLink}
						isExternal={cta.isExternal}
						onClickCapture={cta.onClickCapture}
					/>
				)}
				{showArrow ? (
					<div className={s.arrow}>
						<IconArrowRight24 />
					</div>
				) : null}
			</div>
		</div>
	)
}

const CardCta = ({
	href,
	ctaLabel,
	standaloneLink,
	isExternal,
	onClickCapture,
}: CardCtaProps) => {
	const isCardLink = href && !ctaLabel

	if (standaloneLink) {
		const standaloneLinkProps = {
			...standaloneLink,
			icon: standaloneLink.icon || 'chevron-right',
			iconPosition: standaloneLink.iconPosition || 'trailing',
		}

		return <StandaloneLink className={s.cta} {...standaloneLinkProps} />
	}

	return (
		href &&
		!isCardLink &&
		ctaLabel && (
			<StandaloneLink
				className={s.cta}
				text={ctaLabel}
				href={href}
				icon="chevron-right"
				iconPosition="trailing"
				color="secondary"
				onClickCapture={onClickCapture}
				isHrefExternal={isExternal}
			/>
		)
	)
}

const CardThumbnail = ({ alt, aspectRatio, src }: CardThumbnailProps) =>
	src ? (
		<div
			className={s.thumbnail}
			style={{ ['--aspect-ratio' as string]: aspectRatio }}
		>
			<Image fill alt={alt} src={src} />
		</div>
	) : null

const CardEyebrow = ({ children }: PropsWithChildren) => {
	if (!children) {
		return null
	}

	if (Array.isArray(children)) {
		return <CardEyebrowList items={Array.from(children)} />
	}

	return <CardEyebrowText>{children}</CardEyebrowText>
}

const CardEyebrowList = ({ items }: { items: string[] }) => (
	<ul className={s.meta}>
		{items.map((item, idx) => (
			<li key={item}>
				<CardEyebrowText>{item}</CardEyebrowText>
				{idx < items.length - 1 ? (
					<span className={s.metaSeparator} aria-hidden={true}>
						|
					</span>
				) : null}
			</li>
		))}
	</ul>
)

const CardEyebrowText = ({ children }: PropsWithChildren) =>
	children ? (
		<Text.Label color="faint" weight="medium">
			{children}
		</Text.Label>
	) : null

const CardHeading = ({ children }: PropsWithChildren) =>
	children ? (
		<Text.DisplayExpressive
			tag="span"
			size="200"
			weight="semibold"
			color="strong"
		>
			{children}
		</Text.DisplayExpressive>
	) : null

const CardSubheading = ({ children }: PropsWithChildren) =>
	children ? (
		<Text.Body tag="span" size="200" className={s.subheading} color="primary">
			{children}
		</Text.Body>
	) : null

const CardDescription = ({ children }: PropsWithChildren) => {
	if (!children) {
		return null
	}

	if (typeof children === 'string') {
		return (
			<Text.Body tag="span" size="200" color="primary">
				{children}
			</Text.Body>
		)
	}

	return children
}

const Badges = ({ badges }: { badges: CardContentProps['badges'] }) =>
	badges && badges.length > 0 ? (
		<div className={s.badges}>
			{badges.map((badge) => (
				<Badge key={badge.text} {...badge} />
			))}
		</div>
	) : null

Card.displayName = 'Card'
export { Card }
