/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BreadcrumbBar from '../index'
import { render } from '@testing-library/react'
import React from 'react'

// Mock next/head so that we can see its children
vi.mock('next/head', () => {
	return {
		__esModule: true,
		default: ({ children }: React.PropsWithChildren<$TSFixMe>) => {
			return <div>{children}</div>
		},
	}
})

describe('BreadcrumbBar', () => {
	it('should render structured data with only items that have a url', () => {
		const { container } = render(
			<BreadcrumbBar
				links={[
					{ title: 'Developer', url: '/' },
					{ title: 'Consul', url: '/consul' },
					{ title: 'Documentation', url: '/consul/docs', isCurrentPage: false },
					{ title: 'Dynamic App Configuration' },
					{
						isCurrentPage: true,
						title: 'Sessions',
						url: '/consul/docs/automate/session',
					},
				]}
			/>
		)

		const structuredDataScript = container.querySelector(
			'script[type="application/ld+json"]'
		)
		expect(structuredDataScript).toBeInTheDocument()
		const structuredData = JSON.parse(structuredDataScript.textContent)

		expect(structuredData[0].itemListElement).toHaveLength(4)

		expect(structuredData).toMatchInlineSnapshot(`
			[
			  {
			    "@context": "https://schema.org",
			    "@type": "BreadcrumbList",
			    "itemListElement": [
			      {
			        "@type": "ListItem",
			        "item": "https://developer.hashicorp.com/",
			        "name": "Developer",
			        "position": 1,
			      },
			      {
			        "@type": "ListItem",
			        "item": "https://developer.hashicorp.com/consul",
			        "name": "Consul",
			        "position": 2,
			      },
			      {
			        "@type": "ListItem",
			        "item": "https://developer.hashicorp.com/consul/docs",
			        "name": "Documentation",
			        "position": 3,
			      },
			      {
			        "@type": "ListItem",
			        "item": "https://developer.hashicorp.com/consul/docs/automate/session",
			        "name": "Sessions",
			        "position": 4,
			      },
			    ],
			  },
			]
		`)
	})
})
