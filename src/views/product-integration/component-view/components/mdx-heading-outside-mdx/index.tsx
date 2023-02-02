import {
	MdxH1,
	MdxH2,
	MdxH3,
	MdxH4,
	MdxH5,
	MdxH6,
} from 'components/dev-dot-content/mdx-components'
import MdxHeadingPermalink from 'components/dev-dot-content/mdx-components/mdx-heading-permalink'
import { HeadingProps } from 'components/heading'

/**
 * Map from a heading level to a specific MDX heading component.
 */
const mdxHeadingMap: Record<
	HeadingProps['level'],
	(props: $TSFixMe) => JSX.Element
> = {
	1: MdxH1,
	2: MdxH2,
	3: MdxH3,
	4: MdxH4,
	5: MdxH5,
	6: MdxH6,
}

/**
 * Render a heading that matches how headings are rendered in MDX,
 * including our MDX-style permalink component.
 */
export function MdxHeadingOutsideMdx({
	id,
	title,
	level,
}: {
	id: string
	title: string
	level: HeadingProps['level']
}) {
	const Component = mdxHeadingMap[level]
	return (
		<Component id={id}>
			<MdxHeadingPermalink
				/* Note: the `__permalink-h` class is needed for correct hover styles,
			   as our MdxHeadings use a `:global` selector that targets it.
				 TODO: consider alternatives, eg parent selector or useHover hook. */
				className="__permalink-h"
				href={`#${id}`}
				level={level}
				ariaLabel={title}
			/>
			{title}
		</Component>
	)
}
