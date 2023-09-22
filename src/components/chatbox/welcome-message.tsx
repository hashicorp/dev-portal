import { IconBulb16 } from '@hashicorp/flight-icons/svg-react/bulb-16'
import { IconDiscussionCircle16 } from '@hashicorp/flight-icons/svg-react/discussion-circle-16'
import { IconUser16 } from '@hashicorp/flight-icons/svg-react/user-16'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'
import classNames from 'classnames'

import Heading from 'components/heading'
import Text from 'components/text'

import s from './welcome-message.module.css'

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
						Welcome to Developer AI
					</Heading>
					<Text /* Body/100/Medium */
						className={s.faint}
						size={100}
						weight="medium"
					>
						Your personal AI-powered assistant, we’re ready to help you get the
						most out of Developer. Let’s get started on this journey together...
					</Text>
				</div>
			</div>
			<div className={classNames(s.col, s.right)}>
				<div className={s.row}>
					<IconUser16 />
					<div>
						<Heading /* Display/100/Medium */
							className={s.strong}
							level={4}
							weight="medium"
							size={100}
						>
							Personalized recommendations
						</Heading>
						<Text /* Body/100/Regular */
							size={100}
							weight="regular"
							className={s.faint}
						>
							Coming soon...
						</Text>
					</div>
				</div>
				<div className={s.row}>
					<IconDiscussionCircle16 />
					<div>
						<Heading /* Display/100/Medium */
							className={s.strong}
							level={4}
							weight="medium"
							size={100}
						>
							Natural language conversations
						</Heading>
						<Text /* Body/100/Regular */
							className={s.faint}
							size={100}
							weight="regular"
						>
							Coming soon...
						</Text>
					</div>
				</div>
				<div className={s.row}>
					<IconBulb16 />
					<div>
						<Heading /* Display/100/Medium */
							className={s.strong}
							level={4}
							weight="medium"
							size={100}
						>
							Knowledge base
						</Heading>
						<Text /* Body/100/Regular */
							className={s.faint}
							size={100}
							weight="regular"
						>
							Yes
						</Text>
					</div>
				</div>
			</div>
		</div>
	)
}
