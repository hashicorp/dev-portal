import classNames from 'classnames'
import InlineSvg from '@hashicorp/react-inline-svg'
import s from './content-types-section.module.css'

// TODO update imageSource to `icon`
interface ContentTypesSectionItem {
	imageSource: string
	title: string
	description: string
}

interface ContentTypesSectionProps {
	className?: string
	items: ContentTypesSectionItem[]
	title: string
}

const ContentTypesSection = ({
	className,
	items,
	title,
}: ContentTypesSectionProps) => {
	return (
		<div className={classNames(s.root, className)}>
			<h2 className={s.title}>{title}</h2>
			<ul className={s.list}>
				{items.map(
					({ imageSource, title, description }: ContentTypesSectionItem) => {
						return (
							<li key={title} className={s.listItem}>
								<InlineSvg className={s.listItemIcon} src={imageSource} />
								<div className={s.listItemTextContainer}>
									<h3 className={s.listItemTitle}>{title}</h3>
									<p className={s.listItemDescription}>{description}</p>
								</div>
							</li>
						)
					}
				)}
			</ul>
		</div>
	)
}

export { ContentTypesSection }
