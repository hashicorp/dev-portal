import s from './style.module.css'

export interface Tag {
	name: string
	icon?: React.ReactNode
	description?: string // TODO: Build a tooltip here for this
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
						{tag.icon && <span className={s.icon}>{tag.icon}</span>}
						<span>{tag.name}</span>
					</li>
				)
			})}
		</ul>
	)
}
