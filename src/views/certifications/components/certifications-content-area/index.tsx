import { ReactNode } from 'react'
import s from './certifications-content-area.module.css'

export function CertificationsContentArea({
	children,
}: {
	children: ReactNode
}) {
	return <div className={s.root}>{children}</div>
}
