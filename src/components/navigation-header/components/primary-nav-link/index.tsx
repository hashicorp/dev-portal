import Link from 'next/link'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import useCurrentPath from 'hooks/use-current-path'
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
		<Link href={url}>
			<a
				aria-current={isCurrentPage ? 'page' : undefined}
				aria-label={ariaLabel}
				className={s.root}
				target={openInNewTab ? '_blank' : undefined}
			>
				<Text
					asElement="span"
					className={s.linkText}
					size={200}
					weight="medium"
				>
					{label}
				</Text>
				{openInNewTab ? <IconExternalLink16 /> : null}
			</a>
		</Link>
	)
}

export default PrimaryNavLink
