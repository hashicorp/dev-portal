import Alert, { AlertProps } from 'components/alert'
import s from './mdx-alert.module.css'

export function MdxAlert(props: AlertProps) {
	return (
		<div className={s.alertWrapper}>
			<Alert {...props} />
		</div>
	)
}
