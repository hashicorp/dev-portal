/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import rehypeSanitize from 'rehype-sanitize'
import { defaultSchema } from 'hast-util-sanitize/lib/schema'
import { deepmerge } from 'deepmerge-ts'

/**
 * Build off of the default `rehype-sanitize`, adding minimal
 * allowed properties for our rich content to render as expected.
 */
const schema = deepmerge(defaultSchema, {
	/**
	 * We want to enable `inlineCode` tagNames, which are a custom part of
	 * the [MDX version of hast](https://mdxjs.com/advanced/ast).
	 * `rehype-sanitize` does not recognize these as valid elements by default,
	 * as it's typically used on plain markdown or HTML, not MDX, I think.
	 */
	tagNames: [...defaultSchema.tagNames, 'inlineCode'],
	attributes: {
		'*': [
			/**
			 * We enable class names for all elements.
			 *
			 * This allows "paragraph custom alerts" as well as our `rehype-prism`
			 * syntax highlighting to function as expected.
			 * - Our paragraph custom alerts: https://github.com/hashicorp/remark-plugins/tree/main/plugins/paragraph-custom-alerts
			 * - Our `rehype-prism` setup: https://github.com/hashicorp/web-platform-packages/tree/main/packages/code-highlighting
			 *
			 * Note: we could create more strictly scope rules here, instead of allowing
			 * all class name values on all elements. However, there doesn't seem to be
			 * any security concern here, and a stricter set of specific strings and
			 * regex patterns for classNames would be much more difficult to maintain.
			 */
			'className',
			/**
			 * `data-text-content` is used for our `remark-plugin-anchor-links-data`.
			 * We enable data-text-content for all elements (enabling it for heading
			 * elements only would be less clean, and no more safe).
			 *
			 * We use config here to ensure that only alphanumeric characters are
			 * present. Any `data-text-content` attribute with any other characters
			 * will be removed completely.
			 *
			 * In the future, we could safely expand this to 'data*' to avoid having
			 * to maintain and reason about specific use cases.
			 * Ref: https://github.com/syntax-tree/hast-util-sanitize#attributes
			 */
			['data-text-content', /[\w\-\s]+/],
			/**
			 * We enable `style` attributes for all elements so that syntax
			 * highlighting can be applied via Shiki. We limit them just to the
			 * format emitted by Shiki.
			 */
			['style', /^color:var\(--hds-code-block-color-[a-z-]*\)$/],
		],
	},
})

/**
 * Export rehype sanitize with configuration baked in
 */
export { schema }
export default rehypeSanitize
