import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Badge from 'components/badge'
import StandaloneLink from 'components/standalone-link'
import s from './status.module.css'

export function Status({ text, href }: { text: string; href: string }) {
	return (
		<div className={s.statusWrapper}>
			<Badge
				text={text}
				type="outlined"
				color="success"
				size="small"
				icon={<IconCheckCircle16 />}
			/>
			<StandaloneLink
				text="Status"
				icon={<IconExternalLink16 />}
				iconPosition="trailing"
				color="secondary"
				href={href}
			/>
		</div>
	)
}
