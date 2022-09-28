import { IconArrowDown16 } from '@hashicorp/flight-icons/svg-react/arrow-down-16'
import { IconArrowUp16 } from '@hashicorp/flight-icons/svg-react/arrow-up-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Badge from 'components/badge'
import Text from 'components/text'
import { FORM_URL } from 'components/navigation-header/components/give-feedback-button'
import StandaloneLink from 'components/standalone-link'
import s from './command-bar-dialog.module.css'
import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'

const CommandBarDialogFooter = () => {
	return (
		<div className={s.footer}>
			<div className={s.footerLeft}>
				<Badge color="neutral" text="Tab" type="outlined" size="small" />
				<Text asElement="span" size={100} weight="regular">
					or
				</Text>
				<div className={s.footerLeftArrowKeys}>
					<Badge
						ariaLabel="Up arrow key"
						color="neutral"
						icon={<IconArrowUp16 />}
						type="outlined"
						size="small"
					/>
					<Badge
						ariaLabel="Down arrow key"
						color="neutral"
						icon={<IconArrowDown16 />}
						type="outlined"
						size="small"
					/>
				</div>
				<Text asElement="span" size={100} weight="regular">
					to navigate,
				</Text>
				<Badge
					ariaLabel="Enter key"
					color="neutral"
					icon={<IconCornerDownLeft16 />}
					type="outlined"
					size="small"
				/>
				<Text asElement="span" size={100} weight="regular">
					to select,
				</Text>
				<Badge color="neutral" text="Esc" type="outlined" size="small" />
				<Text asElement="span" size={100} weight="regular">
					to exit
				</Text>
			</div>
			<div>
				<StandaloneLink
					color="secondary"
					href={FORM_URL}
					icon={<IconExternalLink16 />}
					iconPosition="trailing"
					size="small"
					text="Give Feedback"
					openInNewTab
				/>
			</div>
		</div>
	)
}

export default CommandBarDialogFooter
