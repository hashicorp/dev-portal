import { ReactNode } from 'react'
import s from './certifications-max-width.module.css'

/**
 * Re-usable max-width container for Certifications views.
 *
 * Note that this corresponds to the Home page layout as well, so this
 * component could potentially be lifted further and re-used on the homepage.
 * For now, intent is to keep the scope to Certifications implementation.
 */
export function CertificationsMaxWidth({ children }: { children: ReactNode }) {
	return <div className={s.root}>{children}</div>
}
