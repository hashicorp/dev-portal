import type { HTMLAttributes } from 'react'
import classNames from 'classnames'
import s from './styles.module.css'

interface ListItemTitleProps
	extends Omit<HTMLAttributes<HTMLLIElement>, 'className'> {
	text: string
}

const ListItemTitle = ({ text, ...rest }: ListItemTitleProps) => {
	return (
		<li className={classNames(s['list-item'], s.title)} {...rest}>
			{text}
		</li>
	)
}

ListItemTitle.displayName = 'Dropdown.ListItem.Title'

export type { ListItemTitleProps }
export { ListItemTitle }
