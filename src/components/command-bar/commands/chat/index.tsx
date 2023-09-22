/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArrowLeft24 } from '@hashicorp/flight-icons/svg-react/arrow-left-24'
import { CommandBarCommand } from 'components/command-bar/types'
import ChatBox from 'components/chatbox/chatbox'
import { useCommandBar } from 'components/command-bar'

import s from './chat.module.css'

// An interactive Icon w/ "back" functionality
const Icon = () => {
	const { setCurrentCommand } = useCommandBar()
	return (
		<IconArrowLeft24
			tabIndex={0}
			className={s.backArrow}
			aria-label="Back to search"
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					setCurrentCommand('search')
				}
			}}
			onClick={() => {
				setCurrentCommand('search')
			}}
		/>
	)
}
const chatCommand: CommandBarCommand = {
	name: 'chat',
	icon: <Icon />,
	inputProps: {
		placeholder: () => 'Return to search',
	},
	DialogBody: ChatBox,
}

export default chatCommand
