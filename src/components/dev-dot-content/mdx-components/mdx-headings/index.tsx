import { Children } from 'react'
import classNames from 'classnames'
import Heading, { HeadingProps } from 'components/heading'
import MdxHeadingPermalink from '../mdx-heading-permalink'
import s from './mdx-headings.module.css'

/**
 * Used by `makeHeadingElement`.
 */
const HEADING_LEVELS_TO_PROPS: Record<
	HeadingProps['level'],
	{ size: HeadingProps['size']; weight: HeadingProps['weight'] }
> = {
	1: {
		size: 500,
		weight: 'bold',
	},
	2: {
		size: 400,
		weight: 'bold',
	},
	3: {
		size: 300,
		weight: 'bold',
	},
	4: {
		size: 200,
		weight: 'semibold',
	},
	5: {
		size: 200,
		weight: 'semibold',
	},
	6: {
		size: 200,
		weight: 'semibold',
	},
}

/**
 * Returns a Heading component with a fixed "level", suitable for use in
 * MDX contexts such as docs and tutorial pages.
 *
 * Note: we likely want to explicitly destructure the props incoming
 * from MDX which we want to use. As is, we intentionally override
 * the incoming props.className, props.level, props.size, and props.weight.
 */
export function makeMdxHeadingElement(level: HeadingProps['level']) {
	const fixedClassName = classNames(s.heading, s[`h${level}`])
	const { size, weight } = HEADING_LEVELS_TO_PROPS[level]

	return function MdxHeading(props) {
		const { children, ...rest } = props
		return (
			<Heading
				{...rest}
				level={level}
				className={fixedClassName}
				size={size}
				weight={weight}
			>
				{/* This is a temporary solution to render an updated permalink element while our remark plugin continues to inject the current one. The full implementation will eventually live in this component, but it will require a larger update to the anchorLinks remark plugin.  We detect the injected permalink by the `__permalink-h` class which the remark plugin applies to the element. */}
				{Children.map(children, (child) =>
					child?.props?.className === '__permalink-h' && level !== 1 ? (
						<MdxHeadingPermalink {...child.props} level={level} />
					) : (
						child
					)
				)}
			</Heading>
		)
	}
}

const MdxH1 = makeMdxHeadingElement(1)
const MdxH2 = makeMdxHeadingElement(2)
const MdxH3 = makeMdxHeadingElement(3)
const MdxH4 = makeMdxHeadingElement(4)
const MdxH5 = makeMdxHeadingElement(5)
const MdxH6 = makeMdxHeadingElement(6)

export { MdxH1, MdxH2, MdxH3, MdxH4, MdxH5, MdxH6 }
