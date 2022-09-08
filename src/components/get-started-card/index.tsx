import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { SUPPORTED_ICONS } from 'content/supported-icons'
import ButtonLink from 'components/button-link'
import Card from 'components/card'
import { developmentToast, ToastColor } from 'components/toast'
import IconCardLink from 'components/icon-card-link'
import StandaloneLink from 'components/standalone-link'
import { GetStartedCardProps } from './types'
import s from './get-started-card.module.css'

function GetStartedCard({
	heading,
	headingSlug,
	body,
	ctas,
	iconCardLinks,
	fixedColumns,
}: GetStartedCardProps) {
	const hasCtas = ctas !== undefined && ctas !== null
	const hasIconCardLinks = iconCardLinks !== undefined && iconCardLinks !== null
	/**
	 * For fixed columns mode, where layout is driven by
	 * media queries and explicit column counts.
	 */
	const fixedModeClasses = classNames(
		s.fixedColumnsMode,
		s[`columns${fixedColumns}`]
	)
	if (hasCtas && hasIconCardLinks) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in GetStartedCard',
			description:
				'Both `ctas` and `iconCardLinks` were passed to GetStartedCard. Only provide one.',
		})
	}

	return (
		<Card className={s.card} elevation="base">
			<h2 id={headingSlug} className={s.heading}>
				{heading}
			</h2>
			<p className={s.body}>{body}</p>
			{ctas && ctas.length ? (
				<div className={classNames(s.ctas, fixedColumns && fixedModeClasses)}>
					{ctas.map((cta, idx) => {
						if (idx == 0) {
							// eslint-disable-next-line react/no-array-index-key
							return <ButtonLink key={idx} href={cta.url} text={cta.text} />
						} else {
							return (
								<StandaloneLink
									// eslint-disable-next-line react/no-array-index-key
									key={idx}
									href={cta.url}
									text={cta.text}
									icon={<IconArrowRight16 />}
									iconPosition="trailing"
								/>
							)
						}
					})}
				</div>
			) : null}
			{iconCardLinks && iconCardLinks.length ? (
				<ul
					className={classNames(
						s.iconCardLinks,
						fixedColumns && fixedModeClasses
					)}
				>
					{iconCardLinks.map(({ icon, text, url }) => {
						return (
							<li key={url}>
								<IconCardLink
									icon={SUPPORTED_ICONS[icon]}
									text={text}
									url={url}
								/>
							</li>
						)
					})}
				</ul>
			) : null}
		</Card>
	)
}

export { GetStartedCard }
export default GetStartedCard
