/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children, ReactChild, ReactFragment, ReactPortal } from 'react'
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
		size: 600,
		weight: 'bold',
	},
	2: {
		size: 500,
		weight: 'bold',
	},
	3: {
		size: 400,
		weight: 'bold',
	},
	4: {
		size: 300,
		weight: 'semibold',
	},
	5: {
		size: 300,
		weight: 'semibold',
	},
	6: {
		size: 300,
		weight: 'semibold',
	},
}

function isInjectedPermalink(child: ReactChild | ReactFragment | ReactPortal) {
	const isLiteral = typeof child === 'string' || typeof child === 'number'
	if (isLiteral) {
		return false
	}
	const hasClassName = 'props' in child && 'className' in child.props
	if (!hasClassName) {
		return true
	}
	return child.props.className === '__permalink-h'
}

/* This is a temporary solution to render an updated permalink element while our remark plugin continues to inject the current one. The full implementation will eventually live in this component, but it will require a larger update to the anchorLinks remark plugin.  We detect the injected permalink by the `__permalink-h` class which the remark plugin applies to the element. */

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
		const { children, 'data-text-content': dataTextContent, ...rest } = props

		/**
		 * Normalize children, to avoid rendering legacy injected permalinks.
		 *
		 * Our current `anchor-links` remark plugin injects a `__permalink-h`
		 * element. This injected element markup is fixed, and predates our use of
		 * MDX. MDX gives us the flexibility to render permalinks in components,
		 * rather than have to inject and style potentially brittle static markup.
		 *
		 * In order to meet our current requirements, we remove the injected
		 * element markup by filtering out the element from `children`, and instead
		 * render a more flexible `<MdxHeadingPermalink />` to replace it.
		 */
		let legacyInjectedPermalink
		const normalizedChildren = []
		for (const child of Children.toArray(children)) {
			if (isInjectedPermalink(child)) {
				legacyInjectedPermalink = child
			} else {
				normalizedChildren.push(child)
			}
		}

		/**
		 * Normalize the `aria-label` for the permalink, if present.
		 *
		 * Our current `anchor-links` remark plugin injects a `__permalink-h`
		 * element that has an `aria-label` prop we need for our revised permalink.
		 * It's similar to the `element.textContent` of the heading, which is hard
		 * to get at render time, but easy to get when running our `remark` plugins.
		 *
		 * Our newer `anchor-links` plugin, used for integrations, adds `id` and
		 * `data-text-content` properties to heading elements, without any injected
		 * elements or global classNames.
		 *
		 * In the future, we could avoid injecting a `__permalink-h` element in our
		 * `anchor-links` remark plugin, and instead set `data-text-content` on
		 * the heading element itself, in order to simplify our process here.
		 */
		let permalinkAriaLabel: string
		if (dataTextContent) {
			// If present, build the `aria-label` from the heading text content.
			permalinkAriaLabel = `${dataTextContent} permalink`
		} else if (legacyInjectedPermalink?.props['aria-label']) {
			// Otherwise, grab the aria-label from the injected permalink element.
			// That `aria-label` is already formatted as "<text-content> permalink".
			permalinkAriaLabel = legacyInjectedPermalink?.props['aria-label']
		}

		/**
		 * If we have a permalinkAriaLabel, that means we have the intent to
		 * render a permalink for this heading. We avoid permalinks for `<h1 />`.
		 */
		const shouldRenderPermalink = permalinkAriaLabel && level !== 1

		return (
			<Heading
				{...rest}
				level={level}
				className={fixedClassName}
				size={size}
				weight={weight}
			>
				{shouldRenderPermalink ? (
					<MdxHeadingPermalink
						aria-label={permalinkAriaLabel}
						href={`#${props.id}`}
						level={level}
					/>
				) : null}
				{normalizedChildren}
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
