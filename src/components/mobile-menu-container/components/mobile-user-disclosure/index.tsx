import Link from 'next/link'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconUser16 } from '@hashicorp/flight-icons/svg-react/user-16'
import Disclosure, {
	DisclosureActivator,
	DisclosureContent,
} from 'components/disclosure'
import Text from 'components/text'

const MobileUserDisclosure = ({ items, user }: $TSFixMe) => {
	// eslint-disable-next-line @next/next/no-img-element
	const icon = user.image ? <img alt="" src={user.image} /> : <IconUser16 />

	return (
		<Disclosure>
			<DisclosureActivator>
				<div>
					{icon}
					<Text size={200} weight="regular">
						{/* TODO show nickname if github, email otherwise */}
						{user.nickname}
					</Text>
				</div>
				{/* TODO rotate 180deg when open */}
				<IconChevronDown16 />
			</DisclosureActivator>
			<DisclosureContent>
				<ul>
					{items.map(({ icon, label, href, onClick }, index) => {
						if (!href && !onClick) {
							return null
						}

						let content
						if (href) {
							content = (
								<Link href={href}>
									<a>
										{icon}
										{label}
									</a>
								</Link>
							)
						} else if (onClick) {
							content = (
								<button onClick={onClick}>
									{icon}
									{label}
								</button>
							)
						}

						// eslint-disable-next-line react/no-array-index-key
						return <li key={index}>{content}</li>
					})}
				</ul>
			</DisclosureContent>
		</Disclosure>
	)
}

export default MobileUserDisclosure
