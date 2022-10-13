import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Badge from 'components/badge'
import Text from 'components/text'
import { FORM_URL } from 'components/navigation-header/components/give-feedback-button'
import StandaloneLink from 'components/standalone-link'
import { CommandBarDialogFooterProps } from './types'
import s from './command-bar-dialog.module.css'

const CommandBarDialogFooter = ({
	instructionsElementId,
}: CommandBarDialogFooterProps) => {
	return (
		<div className={s.footer}>
			<div className={s.footerLeft} id={instructionsElementId}>
				<Badge
					ariaLabel="Tab key"
					color="neutral"
					size="small"
					text="Tab"
					type="filled"
				/>
				<Text asElement="span" size={100} weight="regular">
					to navigate,
				</Text>
				<Badge
					ariaLabel="Enter key"
					color="neutral"
					icon={<IconCornerDownLeft16 />}
					size="small"
					type="filled"
				/>
				<Text asElement="span" size={100} weight="regular">
					to select,
				</Text>
				<Badge
					ariaLabel="Escape key"
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
					color="secondary"
					href={FORM_URL}
					icon={<IconExternalLink16 />}
					iconPosition="trailing"
					openInNewTab
					size="small"
					text="Give Feedback"
				/>
			</div>
		</div>
	)
}

export default CommandBarDialogFooter
