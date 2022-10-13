import classNames from 'classnames'
import Image from 'next/image'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import ButtonLink from 'components/button-link'
import s from './give-feedback-button.module.css'

export const FORM_URL = 'https://forms.gle/fnHLuNahLEhjuKvE6'
const LINK_TEXT = 'Give beta feedback'
const LINK_ARIA_LABEL = 'Give beta feedback (opens in new tab)'

function GiveFeedbackButton({
	allowIconOnly = true,
	className,
}: {
	allowIconOnly?: boolean
	className?: string
}) {
	return (
		<div className={className}>
			{allowIconOnly ? (
				<span className={s.iconButtonContainer}>
					<a
						href={FORM_URL}
						aria-label={LINK_ARIA_LABEL}
						className={classNames(s.iconButton, s.primary)}
						target="_blank"
						rel="noreferrer"
					>
						<Image
							alt=""
							src={require('./img/feedback-icon.svg')}
							width={24}
							height={24}
						/>
					</a>
				</span>
			) : null}
			<span className={allowIconOnly ? s.textButtonContainer : undefined}>
				<ButtonLink
					aria-label={LINK_ARIA_LABEL}
					href={FORM_URL}
					icon={<IconExternalLink16 />}
					iconPosition="trailing"
					openInNewTab
					text={LINK_TEXT}
				/>
			</span>
		</div>
	)
}

export default GiveFeedbackButton
