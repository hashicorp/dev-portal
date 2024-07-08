/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Image from 'next/legacy/image'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import ButtonLink from 'components/button-link'
import { FEEDBACK_FORM_URL } from 'constants/feedback-form'
import s from './give-feedback-button.module.css'

const LINK_TEXT = 'Give feedback'
const LINK_ARIA_LABEL = 'Give feedback (opens in new tab)'

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
						href={FEEDBACK_FORM_URL}
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
					href={FEEDBACK_FORM_URL}
					icon={<IconExternalLink16 />}
					iconPosition="trailing"
					opensInNewTab
					text={LINK_TEXT}
				/>
			</span>
		</div>
	)
}

export default GiveFeedbackButton
