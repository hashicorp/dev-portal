import { render } from '@testing-library/react'
import BreadcrumbBar, { Breadcrumb } from './index'

describe('BreadcrumbBar', () => {
	const links = [
		{ title: 'Developer', url: '/' },
		{ title: 'Boundary', url: '/boundary' },
		{ title: 'API', url: '/boundary/api-docs' },
		{
			isCurrentPage: true,
			title: 'Auth Method Service',
			url: '/boundary/api-docs/auth-method-service',
		},
	]

	// see https://developers.google.com/search/docs/advanced/structured-data/breadcrumb#microdata
	it('should satisfy the BreadcrumbList rich results schema', () => {
		const { container } = render(<BreadcrumbBar links={links} />)
		const list = container.querySelector('ol')
		expect(list).toHaveAttribute('itemScope')
		expect(list).toHaveAttribute('itemType', 'http://schema.org/BreadcrumbList')
	})
})

describe('Breadcrumb', () => {
	// see https://developers.google.com/search/docs/advanced/structured-data/breadcrumb#breadcrumb-list
	it('should satisfy the ListItem rich results schema', () => {
		const { container } = render(
			<Breadcrumb title="foo" url="bar" isCurrentPage={false} position="1" />
		)
		const listitem = container.querySelector('li')
		expect(listitem).toHaveAttribute('itemScope')
		expect(listitem).toHaveAttribute('itemType', 'http://schema.org/ListItem')
		expect(listitem).toHaveAttribute('itemProp', 'itemListElement')

		const item = container.querySelector('a')
		expect(item).toHaveAttribute('itemScope')
		expect(item).toHaveAttribute('itemType', 'http://schema.org/Thing')
		expect(item).toHaveAttribute('itemProp', 'item')

		const name = container.querySelector('span')
		expect(name).toHaveAttribute('itemProp', 'name')

		const position = container.querySelector('meta')
		expect(position).toHaveAttribute('itemProp', 'position')
		expect(position).toHaveAttribute('content', '1')
	})
})
