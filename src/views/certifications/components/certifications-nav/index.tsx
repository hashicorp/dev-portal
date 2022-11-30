import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { CertificationsNavProps, CertificationNavItem } from './types'

export function CertificationsNav({ items }: CertificationsNavProps) {
	return (
		<>
			<h2>{`[stub]`} Certification Nav</h2>
			<nav>
				<ul>
					{items.map(({ url, text }: CertificationNavItem) => {
						return (
							<li key={`${text}${url}`} style={{ padding: '4px 0' }}>
								<StandaloneLink
									href={url}
									icon={<IconArrowRight16 />}
									iconPosition="trailing"
									text={text}
								/>
							</li>
						)
					})}
				</ul>
			</nav>
		</>
	)
}
