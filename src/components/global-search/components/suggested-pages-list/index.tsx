import Link from 'next/link'
import Text from 'components/text'
import { SuggestedPage, SuggestedPagesListProps } from './types'
import s from './global-search-suggested-pages-list.module.css'

const SuggestedPagesList = ({ suggestedPages }: SuggestedPagesListProps) => {
	if (!suggestedPages || suggestedPages.length <= 0) {
		return null
	}

	return (
		<>
			<Text asElement="p" className={s.label} size={100} weight="semibold">
				Pages
			</Text>
			<ul className={s.list}>
				{suggestedPages.map((suggestedPage: SuggestedPage) => {
					return (
						<li className={s.listItem} key={suggestedPage.url}>
							<Link href={suggestedPage.url}>
								<a className={s.listItemLink}>
									<span className={s.listItemLinkIcon}>
										{suggestedPage.icon}
									</span>
									<Text
										asElement="span"
										className={s.listItemLinkText}
										size={200}
										weight="medium"
									>
										{suggestedPage.text}
									</Text>
								</a>
							</Link>
						</li>
					)
				})}
			</ul>
		</>
	)
}

export type { SuggestedPage, SuggestedPagesListProps }
export default SuggestedPagesList
