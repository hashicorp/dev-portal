import type { HTMLAttributes } from 'react'
import classNames from 'classnames'
import s from './styles.module.css'

type ListItemSeparatorProps = Omit<
	HTMLAttributes<HTMLLIElement>,
	'className' | 'aria-hidden' | 'role'
>

const ListItemSeparator = (props: ListItemSeparatorProps) => {
	return (
		<li
			className={classNames(s['list-item'], s.separator)}
			aria-hidden="true"
			role="separator"
			{...props}
		></li>
	)
}

ListItemSeparator.displayName = 'Dropdown.ListItem.Separator'

export type { ListItemSeparatorProps }
export { ListItemSeparator }
