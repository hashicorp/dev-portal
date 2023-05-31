import classNames from 'classnames'
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
		<section className={classNames(s.root, className)}>
			<h2 className={s.title}>{title}</h2>
			<ul className={s.list}>
				{items.map(
					({ imageSource, title, description }: ContentTypesSectionItem) => {
						return (
							<li key={title} className={s.listItem}>
								{/* TODO <img /> will be replaced with icon */}
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt="" src={imageSource} />
								<div className={s.listItemTextContainer}>
									<h3 className={s.listItemTitle}>{title}</h3>
									<p className={s.listItemDescription}>{description}</p>
								</div>
							</li>
						)
					}
				)}
			</ul>
		</section>
	)
}

export { ContentTypesSection }
