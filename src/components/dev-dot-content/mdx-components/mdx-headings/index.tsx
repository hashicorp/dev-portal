/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children } from 'react'
import classNames from 'classnames'
import Heading, { HeadingProps } from 'components/heading'
import MdxHeadingPermalink from '../mdx-heading-permalink'
import { isInjectedPermalink } from './utils'
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

/**
 * Returns a Heading component with a fixed "level", suitable for use in
 * MDX contexts such as docs and tutorial pages.
 *
 * Note: we likely want to explicitly destructure the props incoming
 * from MDX which we want to use. As is, we intentionally override
 * the incoming `className`, `level`, `size`, and `weight`, and we
 * intentionally omit the incoming `data-text-content`.
 */
export function makeMdxHeadingElement(level: HeadingProps['level']) {
	const fixedClassName = classNames(s.heading, s[`h${level}`])
	const { size, weight } = HEADING_LEVELS_TO_PROPS[level]

	return function MdxHeading({
		children,
		'data-text-content': dataTextContent,
		id,
		/**
		 * TODO: we likely want to make the purpose of individual attributes
		 * within `...restProps` more explicit, to avoid an opaque spreading
		 * of unknown props. There should be no need for props others than
		 * those explicitly documented in this interface, though that assumption
		 * likely requires some investigation.
		 *
		 * Task: https://app.asana.com/0/1202097197789424/1204434105702090/f
		 */
		...restProps
	}: Omit<HeadingProps, 'size' | 'weight' | 'level' | 'className'> & {
		/**
		 * Optional property to pass the text content of the heading.
		 * Used to generate an `aria-label` for the heading permalink.
		 */
		'data-text-content'?: string
	}) {
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
		 * Our newer `remark-plugin-anchor-links-data`, used for integrations,
		 * adds `id` and `data-text-content` properties to heading elements,
		 * without any injected elements or global classNames.
		 *
		 * In the future, we could switch all use cases to the newer plugin,
		 * to avoid injecting a `__permalink-h` element. This would simplify our
		 * process, but would require contending with a few features of our
		 * older anchor-links plugin
		 *
		 * - "aliases", which are not supported by the new plugin, but which we
		 *   may need to continue to support in historical contexts. We could
		 *   pass these through via a `data-alias-ids` property, rather than
		 *   injecting additional `<a />` elements as we do in the old plugin.
		 * - "list items that start with code" anchor links, which are a feature
		 *   we've considered removing but may still need to support in historical
		 *   contexts. One possibility would be to implement these as a separate
		 *   plugin. It seems the reason we put these in the old anchor-links
		 *   plugin was to avoid `id` collisions. With separate plugins, we could
		 *   avoid `id` collisions by passing existing `anchor-links` as an
		 *   argument to a separate `remark-code-list-item-anchor-links` plugin.
		 *
		 * Task: https://app.asana.com/0/1100423001970639/1202560954440296/f
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
		 * If we have an id & permalinkAriaLabel, that means we have the intent to
		 * render a permalink for this heading. We avoid permalinks for `<h1 />`.
		 */
		const shouldRenderPermalink = id && permalinkAriaLabel && level !== 1

		return (
			<Heading
				{...restProps}
				id={id}
				level={level}
				className={fixedClassName}
				size={size}
				weight={weight}
			>
				{shouldRenderPermalink ? (
					<MdxHeadingPermalink
						ariaLabel={permalinkAriaLabel}
						href={`#${id.replace(/^user-content-/, '')}`}
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
