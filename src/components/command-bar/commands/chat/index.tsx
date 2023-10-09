/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArrowLeft24 } from '@hashicorp/flight-icons/svg-react/arrow-left-24'
import { CommandBarCommand } from 'components/command-bar/types'
import ChatBox from 'components/chatbox/chatbox'
import { useCommandBar } from 'components/command-bar'
import Button from 'components/button'

import s from './chat.module.css'

// A button with an icon and text w/ "back" functionality
const BackButton = () => {
	const { setCurrentCommand } = useCommandBar()
	return (
		<Button
			className={s.backButton}
			color="tertiary"
			size="large"
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
const chatCommand: CommandBarCommand = {
	name: 'chat',
	icon: <BackButton />,
	inputProps: {
		placeholder: () => 'Hide me',
	},
	DialogBody: ChatBox,
}

export default chatCommand
