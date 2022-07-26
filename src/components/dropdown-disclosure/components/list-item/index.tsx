import { useDisclosureState } from 'components/disclosure'
import Text from 'components/text'
import Link from 'next/link'
import s from './list-item.module.css'

const DropdownDisclosureListItem = ({ children }: $TSFixMe) => {
	return <li className={s.root}>{children}</li>
}

const DropdownDisclosureButtonItem = ({
	children,
	icon,
	onClick,
}: $TSFixMe) => {
	const { toggleDisclosure } = useDisclosureState()

	return (
		<DropdownDisclosureListItem>
			<button
				className={s.button}
				onClick={() => {
					onClick()
					toggleDisclosure()
				}}
			>
				{icon}
				<Text asElement="span" size={200} weight="medium">
					{children}
				</Text>
			</button>
		</DropdownDisclosureListItem>
	)
}

const DropdownDisclosureDescriptionItem = ({ children }: $TSFixMe) => {
	return (
		<DropdownDisclosureListItem>
			<Text
				asElement="span"
				className={s.description}
				size={100}
				weight="regular"
			>
				{children}
			</Text>
		</DropdownDisclosureListItem>
	)
}

const DropdownDisclosureLabelItem = ({ children }: $TSFixMe) => {
	return (
		<DropdownDisclosureListItem>
			<Text asElement="span" className={s.label} size={100} weight="semibold">
				{children}
			</Text>
		</DropdownDisclosureListItem>
	)
}
const DropdownDisclosureLinkItem = ({ children, href, icon }: $TSFixMe) => {
	return (
		<DropdownDisclosureListItem>
			<Link href={href}>
				<a className={s.link}>
					{icon}
					<Text asElement="span" size={200} weight="medium">
						{children}
					</Text>
				</a>
			</Link>
		</DropdownDisclosureListItem>
	)
}

const DropdownDisclosureSeparatorItem = () => {
	return (
		<DropdownDisclosureListItem>
			<hr className={s.separator} />
		</DropdownDisclosureListItem>
	)
}

export {
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
}
