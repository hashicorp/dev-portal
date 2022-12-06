import { ReactNode } from 'react'
import s from './button-group.module.css'

export function ButtonGroup({ children }: { children: ReactNode }) {
	return <div className={s.root}>{children}</div>
}
