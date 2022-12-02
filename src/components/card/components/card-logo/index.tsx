import classNames from 'classnames'
import { CardLogoProps } from './types'
import s from './card-logo.module.css'

const CardLogo = ({ children, className }: CardLogoProps) => {
	return <div className={classNames(s.root, className)}>{children}</div>
}

export type { CardLogoProps }
export default CardLogo
