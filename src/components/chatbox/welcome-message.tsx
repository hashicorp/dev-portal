/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconBulb16 } from '@hashicorp/flight-icons/svg-react/bulb-16'
import { IconDiscussionCircle16 } from '@hashicorp/flight-icons/svg-react/discussion-circle-16'
import { IconUser16 } from '@hashicorp/flight-icons/svg-react/user-16'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'
import classNames from 'classnames'

import Heading from 'components/heading'
import Text from 'components/text'

import s from './welcome-message.module.css'

// this is an arbitrary, light abstraction to separate
// the content/copy from the component
const rightColumn = [
	{
		icon: <IconUser16 />,
		heading: 'Personalized recommendations',
		text: 'FIX ME', // TODO(kevinwang): fix before launch
	},
	{
		icon: <IconDiscussionCircle16 />,
		heading: 'Natural language conversations',
		text: 'FIX ME', // TODO(kevinwang): fix before launch
	},
	{
		icon: <IconBulb16 />,
		heading: 'Tap into the HashiCorp knowledge base',
		text: 'FIX ME', // TODO(kevinwang): fix before launch
	},
]

export const WelcomeMessage = () => {
	return (
		<div className={s.welcome}>
			<div className={classNames(s.col, s.left)}>
				<IconWand24 />
				<div className={s.copy}>
					<Heading /* Display/400/Medium */
						className={s.strong}
						level={3}
						weight="medium"
						size={400}
					>
						Developer AI
					</Heading>
					<Text /* Body/100/Medium */
						className={s.faint}
						size={100}
						weight="medium"
					>
						Your AI-powered companion for finding reference materials,
						architectural guidance, and product examples from HashiCorp. Ask me
						anything to get started.
					</Text>
				</div>
				<div className={s.spacer} />
			</div>
			<div className={classNames(s.col, s.right)}>
				{rightColumn.map(({ icon, heading, text }, i) => (
					<div className={s.row} key={i}>
						{icon}
						<div>
							<Heading /* Display/100/Medium */
								className={s.strong}
								level={4}
								weight="medium"
								size={100}
							>
								{heading}
							</Heading>
							<Text /* Body/100/Regular */
								size={100}
								weight="regular"
								className={s.faint}
							>
								{text}
							</Text>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
