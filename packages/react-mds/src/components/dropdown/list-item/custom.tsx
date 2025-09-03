import classNames from 'classnames'
import type { ReactNode } from 'react'
import s from './styles.module.css'

interface ListItemCustomProps {
	children: ReactNode
}

const ListItemCustom = ({ children }: ListItemCustomProps) => {
	return <li className={classNames(s['list-item'], s.custom)}>{children}</li>
}

ListItemCustom.displayName = 'Dropdown.ListItem.Custom'

export type { ListItemCustomProps }
export { ListItemCustom }
