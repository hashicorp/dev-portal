import classNames from 'classnames'
import { DismissButton } from '../dismiss-button'
import type { DetailedHTMLProps, DialogHTMLAttributes } from 'react'
import s from './dialog.module.scss'

interface OverlayProps {
	className?: string
}

const Overlay = ({ className }: OverlayProps) => {
	return <div className={classNames(s.overlay, className)}></div>
}

interface DialogProps
	extends DetailedHTMLProps<
		DialogHTMLAttributes<HTMLDialogElement>,
		HTMLDialogElement
	> {
	onDismiss: () => void
}

const Wrapper = ({ children, className, onDismiss, ...rest }: DialogProps) => {
	return (
		<dialog className={classNames(s.wrapper, className)} {...rest}>
			<DismissButton onClick={onDismiss} className={s.dismiss} />
			{children}
		</dialog>
	)
}

const Dialog = {
	Overlay,
	Wrapper,
}

export { Dialog }
