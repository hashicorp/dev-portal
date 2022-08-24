import { ReactNode } from 'react'
import s from '../../sidebar.module.css'

export default function NavList({ children }: { children: ReactNode }) {
	return <ul className={s.navList}>{children}</ul>
}
