import StandaloneLink from 'components/standalone-link'
import { CertificationsNavProps, CertificationNavItem } from './types'
import s from './certifications-nav.module.css'

export function CertificationsNav({ items }: CertificationsNavProps) {
	return (
		<>
			<div className={s.root}>
				<nav className={s.nav}>
					<p className={s.label}>{`[DEV NAV]`}</p>
					<ul className={s.listRoot}>
						{items.map(({ url, text }: CertificationNavItem) => {
							return (
								<li key={`${text}${url}`} style={{ padding: '4px 0' }}>
									<StandaloneLink
										href={url}
										icon={null}
										iconPosition="trailing"
										text={text}
									/>
								</li>
							)
						})}
					</ul>
				</nav>
			</div>
		</>
	)
}
