/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconArrowLeft24 } from '@hashicorp/flight-icons/svg-react/arrow-left-24'
import { CommandBarCommand } from 'components/command-bar/types'
import ChatBox from 'components/chatbox/chatbox'
import { useCommandBar } from 'components/command-bar'
import Button from 'components/button'
import ButtonLink from 'components/button-link'

import s from './chat.module.css'
import { AI_FEEDBACK_FORM } from 'constants/ai-feedback-form'

// A button with an icon and text w/ "back" functionality
const BackButton = () => {
	const { setCurrentCommand } = useCommandBar()
	return (
		<Button
			className={s.backButton}
			color="tertiary"
			size="medium"
			icon={<IconArrowLeft24 />}
			iconPosition="leading"
			text="Return to Search"
			type="button"
			onClick={() => {
				setCurrentCommand('search')
			}}
		/>
	)
}

const FeedbackButton = () => {
	return (
		<ButtonLink
			color="tertiary"
			size="medium"
			icon={<IconExternalLink16 />}
			iconPosition="trailing"
			text="Share Beta Feedback"
			href={AI_FEEDBACK_FORM}
			opensInNewTab
		/>
	)
}

const chatCommand: CommandBarCommand = {
	name: 'chat',
	icon: <BackButton />,
	inputProps: {
		placeholder: () => 'Return to search',
	},
	DialogBody: ChatBox,
	headerRightSlot: <FeedbackButton />,
}

export default chatCommand
