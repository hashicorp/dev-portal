import { addHeapAttributes } from '../add-heap-attributes'
import { OutlineLinkItem } from 'components/outline-nav/types'

describe('addHeapAttributes', () => {
	it('adds indexed heap attributes to a flat list of outline items', () => {
		const items: OutlineLinkItem[] = [
			{
				title: 'Item One',
				url: '/item-one',
			},
			{
				title: 'Item Two',
				url: '/item-two',
			},
			{
				title: 'Item Three',
				url: '/item-three',
			},
		]
		const result = addHeapAttributes(items)
		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "heapTrack": "toc-list-item-index-0",
		    "title": "Item One",
		    "url": "/item-one",
		  },
		  Object {
		    "heapTrack": "toc-list-item-index-1",
		    "title": "Item Two",
		    "url": "/item-two",
		  },
		  Object {
		    "heapTrack": "toc-list-item-index-2",
		    "title": "Item Three",
		    "url": "/item-three",
		  },
		]
	`)
	})

	it('adds indexed heap attributes to a nested list of outline items', () => {
		const items: OutlineLinkItem[] = [
			{
				title: 'Item One',
				url: '/item-one',
				items: [
					{
						title: 'Nested Item One',
						url: '/nested-item-two',
					},
					{
						title: 'Nested Item Two',
						url: '/nested-item-three',
						items: [
							{
								title: 'Deeply Nested Item One',
								url: '/deeply-nested-item-two',
							},
							{
								title: 'Deeply Nested Item Three',
								url: '/deeply-nested-item-three',
							},
						],
					},
				],
			},
			{
				title: 'Item Two',
				url: '/item-two',
			},
			{
				title: 'Item Three',
				url: '/item-three',
			},
		]
		const result = addHeapAttributes(items)
		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "heapTrack": "toc-list-item-index-0",
		    "items": Array [
		      Object {
		        "heapTrack": "toc-list-item-index-1",
		        "title": "Nested Item One",
		        "url": "/nested-item-two",
		      },
		      Object {
		        "heapTrack": "toc-list-item-index-2",
		        "items": Array [
		          Object {
		            "heapTrack": "toc-list-item-index-3",
		            "title": "Deeply Nested Item One",
		            "url": "/deeply-nested-item-two",
		          },
		          Object {
		            "heapTrack": "toc-list-item-index-4",
		            "title": "Deeply Nested Item Three",
		            "url": "/deeply-nested-item-three",
		          },
		        ],
		        "title": "Nested Item Two",
		        "url": "/nested-item-three",
		      },
		    ],
		    "title": "Item One",
		    "url": "/item-one",
		  },
		  Object {
		    "heapTrack": "toc-list-item-index-5",
		    "title": "Item Two",
		    "url": "/item-two",
		  },
		  Object {
		    "heapTrack": "toc-list-item-index-6",
		    "title": "Item Three",
		    "url": "/item-three",
		  },
		]
	`)
	})
})
