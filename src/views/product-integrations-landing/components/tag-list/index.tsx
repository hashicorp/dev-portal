import { IconArchive16 } from '@hashicorp/flight-icons/svg-react/archive-16'
import { IconHandshake16 } from '@hashicorp/flight-icons/svg-react/handshake-16'
import { IconHashicorp16 } from '@hashicorp/flight-icons/svg-react/hashicorp-16'
import { IconRocket16 } from '@hashicorp/flight-icons/svg-react/rocket-16'
import { IconWrench16 } from '@hashicorp/flight-icons/svg-react/wrench-16'
import classNames from 'classnames'
import Tooltip from 'components/tooltip'
import {
	Flag,
	Integration,
	Tier,
} from 'lib/integrations-api-client/integration'
import s from './style.module.css'

export enum Size {
	SMALL = 'small',
	MEDIUM = 'medium',
}

export interface Tag {
	name: string
	icon?: React.ReactNode
	description: string
}

interface TagListProps {
	tags: Array<Tag>
	size?: Size
}

export default function TagList({ tags, size = Size.SMALL }: TagListProps) {
	return (
		<ul
			className={classNames(s.tagList, {
				[s.medium]: size === Size.MEDIUM,
			})}
		>
			{tags.map((tag: Tag) => {
				return (
					<li key={tag.name}>
						<Tooltip label={tag.description}>
							<div className={s.tagContent}>
								{tag.icon && <span className={s.icon}>{tag.icon}</span>}
								<span>{tag.name}</span>
							</div>
						</Tooltip>
					</li>
				)
			})}
		</ul>
	)
}

export function GetIntegrationTags(
	integration: Integration,
	tierFirst: boolean
): Array<Tag> {
	let tierTag: Tag
	switch (integration.tier) {
		case Tier.OFFICIAL:
			tierTag = {
				name: 'Official',
				icon: <IconHashicorp16 />,
				description:
					'Official integrations are owned and maintained by HashiCorp.',
			}
			break

		case Tier.PARTNER:
			tierTag = {
				name: 'Partner',
				icon: <IconHandshake16 />,
				description:
					'Partner integrations are written, maintained, validated and published by third-party companies. To earn a partner provider badge the partner must participate in the HashiCorp Technology Partner Program.',
			}
			break

		case Tier.COMMUNITY:
			tierTag = {
				name: 'Community',
				description:
					'Community integrations are published by individual maintainers, groups of maintainers, or other members of the HashiCorp community.',
			}
			break
	}

	return [
		...(tierFirst ? [tierTag] : []),
		...integration.flags.map((flag: Flag) => {
			let icon: React.ReactNode = undefined
			switch (flag.slug) {
				case 'builtin':
					icon = <IconWrench16 />
					break

				case 'hcp-ready':
					icon = <IconRocket16 />
					break

				case 'archived':
					icon = <IconArchive16 />
					break
			}

			return {
				name: flag.name,
				description: flag.description,
				icon: icon,
			}
		}),
		...(tierFirst ? [] : [tierTag]),
	]
}
