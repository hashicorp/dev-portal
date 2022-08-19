import Link from 'next/link'
import useCurrentPath from 'hooks/use-current-path'
import Text from 'components/text'
import s from './primary-nav-link.module.css'

export interface PrimaryNavLinkProps {
	ariaLabel: string
	navItem: {
		label: string
		url: string
	}
}

const PrimaryNavLink = ({ ariaLabel, navItem }: PrimaryNavLinkProps) => {
	const { label, url } = navItem
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isCurrentPage = url === currentPath || url === `${currentPath}/`

	return (
		<Link href={url}>
			<a
				aria-current={isCurrentPage ? 'page' : undefined}
				aria-label={ariaLabel}
				className={s.root}
			>
				<Text
					asElement="span"
					className={s.linkText}
					size={200}
					weight="medium"
				>
					{label}
				</Text>
			</a>
		</Link>
	)
}

export default PrimaryNavLink
