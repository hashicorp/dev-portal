import Link from 'next/link'
import { IconChevronDown24 } from '@hashicorp/flight-icons/svg-react/chevron-down-24'
import { getUserMeta } from 'lib/auth/user'
import isAbsoluteUrl from 'lib/is-absolute-url'
import Disclosure, {
	DisclosureActivator,
	DisclosureContent,
} from 'components/disclosure'
import Text from 'components/text'
import { UserDropdownDisclosureItem } from 'components/user-dropdown-disclosure'
import { MobileUserDisclosureProps } from './types'
import s from './mobile-user-disclosure.module.css'

/**
 * Handles rendering a list item for `MobileUserDisclosure`.
 */
const renderItem = (
	{ icon, label, href, onClick }: UserDropdownDisclosureItem,
	index: number
) => {
	if (!href && !onClick) {
		return null
	}
	const isExternal = isAbsoluteUrl(href)
	const rel = isExternal ? 'noreferrer noopener' : undefined
	const target = isExternal ? '_blank' : undefined

	const labelElement = (
		<Text asElement="span" size={200} weight="medium">
			{label}
		</Text>
	)

	let content
	if (href) {
		content = (
			<Link href={href}>
				<a className={s.link} rel={rel} target={target}>
					{icon}
					{labelElement}
				</a>
			</Link>
		)
	} else if (onClick) {
		content = (
			<button className={s.button} onClick={onClick}>
				{icon}
				{labelElement}
			</button>
		)
	}

	// eslint-disable-next-line react/no-array-index-key
	return <li key={index}>{content}</li>
}

const MobileUserDisclosure = ({
	items,
	user,
	initialOpen,
}: MobileUserDisclosureProps) => {
	const { icon, label, description } = getUserMeta(user)

	return (
		<Disclosure containerClassName={s.root} initialOpen={initialOpen}>
			<DisclosureActivator className={s.activator}>
				<span className={s.iconAndTextWrapper}>
					<span className={s.icon}>{icon}</span>
					<Text asElement="span" className={s.text} size={300} weight="medium">
						{description}
					</Text>
				</span>
				<span className={s.chevron}>
					<IconChevronDown24 />
				</span>
			</DisclosureActivator>
			<DisclosureContent className={s.content}>
				<Text asElement="span" className={s.label} size={100} weight="semibold">
					{label}
				</Text>
				<ul className={s.list}>{items.map(renderItem)}</ul>
			</DisclosureContent>
		</Disclosure>
	)
}

export type { MobileUserDisclosureProps }
export default MobileUserDisclosure
