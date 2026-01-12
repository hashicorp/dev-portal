/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { Badge } from '@hashicorp/mds-react/components'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import { FEEDBACK_FORM_URL } from 'constants/feedback-form'
import s from './command-bar-dialog.module.css'
import { useCommandBar } from 'components/command-bar'

const CommandBarDialogFooter = () => {
	const { instructionsElementId } = useCommandBar()
	return (
		<div className={s.footer}>
			<div className={s.footerLeft} id={instructionsElementId}>
				<Badge
					accessibleText="Tab key"
					color="neutral"
					size="small"
					text="Tab"
					type="filled"
				/>
				<Text asElement="span" size={100} weight="regular">
					to navigate,
				</Text>
				<Badge
					accessibleText="Enter key"
					color="neutral"
					icon="corner-down-left"
					size="small"
					type="filled"
				/>
				<Text asElement="span" size={100} weight="regular">
					to select,
				</Text>
				<Badge
					accessibleText="Escape key"
					color="neutral"
					size="small"
					text="Esc"
					type="filled"
				/>
				<Text asElement="span" size={100} weight="regular">
					to exit
				</Text>
			</div>
			<div>
				<StandaloneLink
					className={s.feedbackLink}
					color="secondary"
					href={FEEDBACK_FORM_URL}
					icon={<IconExternalLink16 />}
					iconPosition="trailing"
					opensInNewTab
					size="small"
					text="Give Feedback"
				/>
			</div>
		</div>
	)
}

export default CommandBarDialogFooter
