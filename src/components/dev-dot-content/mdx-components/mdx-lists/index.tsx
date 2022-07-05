import { ReactNode } from 'react'
import s from './mdx-lists.module.css'

function MdxOrderedList({ children }: { children: ReactNode }) {
	return <ol className={s.listRoot}>{children}</ol>
}

function MdxUnorderedList({ children }: { children: ReactNode }) {
	return <ul className={s.listRoot}>{children}</ul>
}

/**
 * Note: the MDX list component below overrides the custom 'li'
 * running in the @hashicorp/remark-plugins "typography" plugin.
 *
 * This plugin is run via the DocsPage component in @hashicorp/docs-page
 * so we need to override it here. https://github.com/hashicorp/web-platform-packages/blob/main/packages/remark-plugins/plugins/typography/index.js#L13
 *
 * @TODO cleanup use of remark plugins in @hashicorp/docs-page so these overrides aren't necessary.
 * Or decouple the dev portal docs page from this legacy component. https://app.asana.com/0/1202097197789424/1202310153805071
 */

function MdxListItem({ children }: { children: ReactNode }) {
	return <li className={s.listItem}>{children}</li>
}

export { MdxListItem, MdxOrderedList, MdxUnorderedList }
export default MdxListItem
