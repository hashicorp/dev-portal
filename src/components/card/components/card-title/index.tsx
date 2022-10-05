import classNames from 'classnames'
import { CardTitleProps } from './types'
import s from './card-title.module.css'

const CardTitle = ({ className, text }: CardTitleProps) => {
	return <div className={classNames(s.root, className)}>{text}</div>
}

export type { CardTitleProps }
export default CardTitle
