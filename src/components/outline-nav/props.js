/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/* Note: please keep this in sync with `types.ts`.
   TODO: If Swingset supported Typescript types, we'd be able to skip this.
	 Task: https://app.asana.com/0/1199715139452823/1199702038395513/f */
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
