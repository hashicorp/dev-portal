import Alert, { InlineAlertProps } from 'components/inline-alert'
import s from './mdx-inline-alert.module.css'

export function MdxInlineAlert(props: InlineAlertProps) {
	return (
		<div className={s.spacing}>
			<Alert {...props} />
		</div>
	)
}
