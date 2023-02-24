import { OutlineListItems, OutlineLink } from '..'
import type { OutlineLinkWithNestingProps } from '../../types'
import s from './outline-link-with-nesting.module.css'

/**
 * Render an outline nav link,
 * with additional outline links indented in a nested section.
 */
function OutlineLinkWithNesting({
	title,
	url,
	isActive,
	items,
	dataHeapTrack,
}: OutlineLinkWithNestingProps) {
	return (
		<>
			<OutlineLink
				title={title}
				url={url}
				isActive={isActive}
				dataHeapTrack={dataHeapTrack}
			/>
			<ol className={s.nested} aria-label={title}>
				<OutlineListItems items={items} />
			</ol>
		</>
	)
}

export { OutlineLinkWithNesting }
