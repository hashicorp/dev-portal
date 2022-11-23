import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import useCurrentPath from 'hooks/use-current-path'
import Link from 'components/link'
import Text from 'components/text'
import s from './primary-nav-link.module.css'

export interface PrimaryNavLinkProps {
	ariaLabel: string
	navItem: {
		label: string
		url: string
		openInNewTab?: boolean
	}
}

const PrimaryNavLink = ({ ariaLabel, navItem }: PrimaryNavLinkProps) => {
	const { label, url, openInNewTab } = navItem
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isCurrentPage = url === currentPath || url === `${currentPath}/`

	return (
		<Link
			aria-current={isCurrentPage ? 'page' : undefined}
			aria-label={ariaLabel}
			className={s.root}
			data-heap-track="navigation-header-primary-nav-link"
			href={url}
			opensInNewTab={openInNewTab}
		>
			<Text asElement="span" className={s.linkText} size={200} weight="medium">
				{label}
			</Text>
			{openInNewTab ? <IconExternalLink16 /> : null}
		</Link>
	)
}

export default PrimaryNavLink
