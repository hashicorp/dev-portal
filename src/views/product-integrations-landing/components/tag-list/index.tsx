import Tooltip from 'components/tooltip'
import s from './style.module.css'

export interface Tag {
	name: string
	icon?: React.ReactNode
	description: string
}

interface TagListProps {
	tags: Array<Tag>
}

export default function TagList({ tags }: TagListProps) {
	return (
		<ul className={s.tagList}>
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
