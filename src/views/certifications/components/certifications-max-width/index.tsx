import { ReactNode } from 'react'
import s from './certifications-max-width.module.css'

export function CertificationsMaxWidth({ children }: { children: ReactNode }) {
	return <div className={s.root}>{children}</div>
}
