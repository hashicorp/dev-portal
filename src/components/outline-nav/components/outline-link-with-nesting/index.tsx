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
			<div className={s.nested}>
				<OutlineListItems items={items} />
			</div>
		</>
	)
}

export { OutlineLinkWithNesting }
