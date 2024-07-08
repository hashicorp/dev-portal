/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import InlineLink from 'components/inline-link'
import s from './mdx-a.module.css'

function MdxA({ children, className, href, ...restProps }) {
	/**
	 * Some of the <a /> elements in markdown content are expected to be
	 * injected by our anchor-links plugin.
	 * We don't want to render InlineLink for these injected permalinks.
	 * These permalinks are expected to contain the "»" character as children.
	 * We want to render these links as-is, and ensure they're hidden.
	 *
	 * Ref:
	 * https://github.com/hashicorp/remark-plugins/blob/28ddcea4ecf23c07e4942cfe76014d85241cab27/plugins/anchor-links/index.js#L103
	 * Asana task to create Heading Permalink component:
	 * https://app.asana.com/0/1202097197789424/1201532549545236/f
	 */
	const isInjectedPermalink = typeof children === 'string' && children == '»'
	if (isInjectedPermalink) {
		return (
			<a
				{...restProps}
				className={classNames(className, s.hiddenPermalink)}
				href={href}
			>
				{children}
			</a>
		)
	}

	/**
	 * An undefined "href" is possible for some of the extra "target" <a> elements
	 * that are added by our `anchor-links` remark plugin. These elements have
	 * an "id", and act as a target for anchor links, but do not have an href.
	 *
	 * For now, we still want to render these elements, as they're needed
	 * for some anchor links to function.
	 *
	 * FUTURE TODOs
	 *   - update the plugin to no longer add empty <a> elements
	 *   - update this to throw an error if href is falsy
	 *
	 * Asana task:
	 * https://app.asana.com/0/1100423001970639/1202560954440296/f
	 */
	const hrefWithFallback = href || '#'

	/**
	 * The targets for the anchor links have the aria-hidden attribute added
	 * from the `anchor-links` remark plugin. Since they should be hidden
	 * from screen readers, the tabIndex needs to be set to -1 to prevent
	 * focus from being captured during keyboard navigation.
	 */
	return (
		<InlineLink
			{...restProps}
			className={className}
			href={hrefWithFallback}
			tabIndex={className === '__target-lic' ? -1 : undefined}
		>
			{children}
		</InlineLink>
	)
}

export { MdxA }
