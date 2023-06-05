/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const boundaryPageProps = require('./fixtures/generated/boundary-page-props.json')
const packerPageProps = require('./fixtures/generated/packer-page-props.json')
const baseProps = {
	description:
		'A lower-case product identifier to pull in respective theme colors. The default is hashicorp blue.',
	type: 'string',
	control: { type: 'select' },
	options: [
		'hashicorp',
		'boundary',
		'consul',
		'nomad',
		'packer',
		'terraform',
		'vault',
		'vagrant',
		'waypoint',
	],
	testValue: 'terraform',
	required: false,
}

module.exports = {
	siteName: {
		type: 'string',
		description:
			"Optional siteName suffix for the page meta `<title />`. Should generally match the siteName value in the consuming project's `_app.jsx` file.",
		required: true,
	},
	productSlug: {
		...baseProps.product,
	},
	className: {
		type: 'function',
		description: 'Optional className to add to the root element.',
	},
	info: {
		type: 'object',
		description:
			"Generated using this component's `server.js` utilities. Object with properties `{ title, description }`. `info.title` is used as the page title, both visibly and in the meta `<title />` on the index page. `info.description` is used for page meta `<description />`.",
		required: true,
		defaultValue: boundaryPageProps.info,
		fixtureValues: {
			boundary: boundaryPageProps.info,
			packer: packerPageProps.info,
		},
	},
	navData: {
		type: 'array',
		description:
			"Generated using this component's `server.js` utilities. Data to be passed to the `DocsSidenav` component that this page renders.",
		required: true,
		defaultValue: boundaryPageProps.navData,
		fixtureValues: {
			boundary: boundaryPageProps.navData,
			packer: packerPageProps.navData,
		},
	},
	operationCategory: {
		type: 'object',
		description:
			"Generated using this component's `server.js` utilities. Optional object with properties `{ name, operations }`, provided where the page will display operations. `name` is a pretty name to display as the page and meta `<title />` on the category page. `operations` is an array of OperationObjects to render on the category's page.",
		defaultValue: boundaryPageProps.operationCategory,
		fixtureValues: {
			boundary: boundaryPageProps.operationCategory,
			packer: packerPageProps.operationCategory,
		},
	},
	isSingleService: {
		type: 'boolean',
		description:
			"Generated using this component's `server.js` utilities. If the OpenAPI specification contains only a single service (aka operation category), this flag will be set to true, and only a single index route will be rendered, showing the single service.",
		defaultValue: boundaryPageProps.isSingleService,
		fixtureValues: {
			boundary: boundaryPageProps.isSingleService,
			packer: packerPageProps.isSingleService,
		},
	},
	currentPath: {
		type: 'string',
		description:
			"Generated using this component's `server.js` utilities. Path for the current page starting from the dynamic route where the OpenAPI page is being rendered, joined by a `/` character.",
		required: true,
		defaultValue: boundaryPageProps.currentPath,
		fixtureValues: {
			boundary: boundaryPageProps.currentPath,
			packer: packerPageProps.currentPath,
		},
	},
	baseRoute: {
		type: 'string',
		description:
			"Path to the dynamic route where the OpenAPI page is being rendered. Passed to `DocsSidenav`'s `basePath` prop.",
		required: true,
	},
	massageOperationPathFn: {
		type: 'function',
		description:
			"An optional function to modify each operation's path for more convenient display. One use case is in the HCP Packer OpenAPI docs, where each path is extremely long, and truncating a common prefix off each path makes them much clearer to display.",
	},
	renderOperationIntro: {
		type: 'function',
		description:
			'An optional render function to display introductory content at the start of each operation detail section. This render function is call with an argument `({ data })`, where `data` is the specific [Operation Object](https://swagger.io/specification/v2/#operation-object) data. One use case is in the HCP Packer OpenAPI docs, where we want to clarify that operation paths have been truncated, and show the full, non-truncated paths in an information box at the top of each operation detail section.',
	},
}
