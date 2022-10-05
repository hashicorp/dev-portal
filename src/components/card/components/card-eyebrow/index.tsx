import classNames from 'classnames'
import { CardEyebrowProps } from './types'
import s from './card-eyebrow.module.css'

const CardEyebrow = ({ children, className }: CardEyebrowProps) => {
	return <div className={classNames(s.root, className)}>{children}</div>
}

export type { CardEyebrowProps }
export default CardEyebrow
