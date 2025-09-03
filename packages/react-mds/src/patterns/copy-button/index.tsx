import { useRef, useState } from 'react'
import { onClickHandler, type HandlerArgs } from './clipboard'
import classNames from 'classnames'
import { HDSButton } from '../../hds/components/button'
import s from './style.module.css'

export interface CopyButtonProps {
	size?: 'small' | 'medium'
	isIconOnly?: boolean
	isFullWidth?: boolean
	text: string
	textToCopy?: string
	getTextFn?: () => string
	targetToCopy?: string | Element
	onSuccess?: (args: HandlerArgs) => void
	onError?: (args: HandlerArgs) => void
	className?: string
	defaultIcon?: string
}

const DEFAULT_ICON = 'clipboard-copy'
const SUCCESS_ICON = 'clipboard-checked'
const ERROR_ICON = 'clipboard-x'
const DEFAULT_STATUS = 'idle'

const CopyButton = ({
	size = 'medium',
	isIconOnly = false,
	isFullWidth = false,
	text,
	textToCopy,
	getTextFn,
	targetToCopy,
	onSuccess,
	onError,
	className,
	defaultIcon,
	...rest
}: CopyButtonProps) => {
	const [status, setStatus] = useState(DEFAULT_STATUS)
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const icon =
		status === 'idle'
			? defaultIcon || DEFAULT_ICON
			: status === 'success'
			? SUCCESS_ICON
			: ERROR_ICON

	const resetStatusDelayed = () => {
		if (timer.current) {
			clearTimeout(timer.current)
		}
		timer.current = setTimeout(() => {
			setStatus(DEFAULT_STATUS)
		}, 1500)
	}

	const _onSuccess = (args: HandlerArgs) => {
		setStatus('success')
		resetStatusDelayed()

		if (onSuccess) {
			onSuccess(args)
		}
	}

	const _onError = (args: HandlerArgs) => {
		setStatus('error')
		resetStatusDelayed()

		if (onError) {
			onError(args)
		}
	}

	return (
		<HDSButton
			className={classNames(s['copy-button'], s[status], className)}
			size={size}
			isFullWidth={isFullWidth}
			text={text}
			icon={icon}
			isIconOnly={isIconOnly}
			color="secondary"
			iconPosition="trailing"
			{...onClickHandler({
				text: textToCopy,
				getTextFn: getTextFn,
				target: targetToCopy,
				onSuccess: _onSuccess,
				onError: _onError,
			})}
			{...rest}
		/>
	)
}

export { CopyButton }
