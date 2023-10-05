/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArrowLeft24 } from '@hashicorp/flight-icons/svg-react/arrow-left-24'
import { CommandBarCommand } from 'components/command-bar/types'
import ChatBox from 'components/chatbox/chatbox'
import { useCommandBar } from 'components/command-bar'
import Text from 'components/text'

import s from './chat.module.css'

// A button with an icon and text w/ "back" functionality
// TODO this is hacky?
const Icon = () => {
	const { setCurrentCommand } = useCommandBar()
	return (
		<button
			className={s.backButton}
			// icon={<IconArrowLeft24 />}
			// iconPosition="leading"
			// text="Return to Search"
			type="button"
			onClick={() => {
				setCurrentCommand('search')
			}}
		>
			<span className={s.leadingIcon}>
				<IconArrowLeft24 />
			</span>
			<Text asElement="span" className={s.text} size={300} weight="regular">
				Return to search
			</Text>
		</button>
	)
}
const chatCommand: CommandBarCommand = {
	name: 'chat',
	icon: <Icon />,
	inputProps: {
		placeholder: () => 'Hide me',
	},
	DialogBody: ChatBox,
}

export default chatCommand
