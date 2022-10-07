import classNames from 'classnames'
import { CardEyebrowProps, CardEyebrowTextProps } from './types'
import s from './card-eyebrow.module.css'

const CardEyebrow = ({ children, className }: CardEyebrowProps) => {
	return <div className={classNames(s.root, className)}>{children}</div>
}

const CardEyebrowText = ({ children }: CardEyebrowTextProps) => {
	return <span className={s.text}>{children}</span>
}

export type { CardEyebrowProps, CardEyebrowTextProps }
export { CardEyebrowText }
export default CardEyebrow
