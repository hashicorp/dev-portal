/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports = {
	items: {
		type: 'array',
		description: 'An array of links to render in the nav.',
		required: true,
		properties: [
			{
				type: 'object',
				properties: {
					title: {
						type: 'string',
						required: true,
						description: 'Text for the link.',
					},
					url: {
						type: 'string',
						required: true,
						description: 'The URL to link to.',
					},
					isActive: {
						type: 'boolean',
						description: 'If `true`, the link will be styled as active.',
					},
					items: {
						type: 'object',
						description:
							'If provided, an indented list of further links will be rendered. Each item requires the same `{ title, url, isActive }` props as detailed above.',
					},
				},
			},
		],
	},
}
