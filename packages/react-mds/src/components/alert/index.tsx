import classNames from 'classnames'
import { useId } from 'react'
import { DismissButton } from '../dismiss-button'
import { StandaloneLink, type StandaloneLinkProps } from '../standalone-link'
import { Icon } from './icon'
import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { HDSButton, HDSButtonProps } from '../../hds/components/button'
import s from './alert.module.scss'
import { FlightIconName } from '../flight-icon'

type AlertColor = 'neutral' | 'highlight' | 'success' | 'warning' | 'critical'

interface CommonAlertProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Sets the color scheme for `background`, `border`, `title`, and `description`, which cannot be overridden.
	 * `color` results in a default icon, which can be overridden.
	 * default: `neutral`
	 */
	color?: AlertColor
	/**
	 * The alert can be dismissed by the user. When a function is passed, the "dismiss" button is displayed.
	 */
	onDismiss?: () => void
	/**
	 * A string used for the title of the alert.
	 * Alert must have either a title or a description, or both.
	 */
	title?: string
	/**
	 * A plain text string or basic html that is used for the description.
	 * Alert must have either a title or a description, or both.
	 */
	description?: ReactNode
	/**
	 * Role for the alert.
	 * `alertdialog` should be used when the alert includes interactive elements (<Alert.Actions>).
	 * `alert` should be used for all other scenarios.
	 */
	role: 'alert' | 'alertdialog'
}

type AlertProps =
	| (CommonAlertProps & {
			/** compact alerts must specify an icon */
			type: 'compact'
			/** an icon from the Flight Icon set or false to hide the default icon */
			icon?: FlightIconName
	  })
	| (CommonAlertProps & {
			/** page & inline alerts get an optional icon override */
			type: 'page' | 'inline'
			/** an icon from the Flight Icon set or false to hide the default icon */
			icon?: FlightIconName | false
	  })

const Alert = ({
	type,
	color = 'neutral',
	icon,
	onDismiss,
	title,
	description,
	children,
	role,
	className,
	...rest
}: AlertProps) => {
	if (!title && !description) {
		throw new Error(
			'Alert must include either a title or a description, or both'
		)
	}

	// `alertdialog` must have an accessible name so we use either the
	// title or the description as label for the alert
	const generatedLabelId = useId()

	return (
		<div
			className={classNames(
				s.alert,
				s[`type-${type}`],
				s[`color-${color}`],
				className
			)}
			role={role}
			aria-live="polite"
			aria-labelledby={generatedLabelId}
			{...rest}
		>
			<Icon icon={icon} type={type} color={color} />
			<div className={s.content}>
				<div
					className={classNames(
						s.text,
						type === 'compact'
							? 'token-typography-body-100'
							: 'token-typography-body-200'
					)}
				>
					{title && (
						<div
							className={classNames(
								s.title,
								'mds-typography-font-weight-semibold'
							)}
							id={generatedLabelId}
						>
							{title}
						</div>
					)}
					{description && (
						<div
							className={classNames(
								s.description,
								'mds-typography-font-weight-regular token-foreground-primary'
							)}
							id={!title ? generatedLabelId : undefined}
						>
							{description}
						</div>
					)}
				</div>
				{children}
			</div>
			{onDismiss && (
				<div className={s['dismiss-button-wrapper']}>
					<DismissButton onClick={onDismiss} />
				</div>
			)}
		</div>
	)
}

const AlertActions = ({ children }: PropsWithChildren) => {
	return <div className={s.actions}>{children}</div>
}

const AlertButton = ({ ...props }: Exclude<HDSButtonProps, 'size'>) => {
	return <HDSButton size="small" {...props} />
}

const AlertStandaloneLink = ({
	...props
}: Exclude<StandaloneLinkProps, 'size'>) => {
	return <StandaloneLink size="small" {...props} />
}

export { Alert, AlertActions, AlertButton, AlertStandaloneLink }
export type { AlertProps, AlertColor }
