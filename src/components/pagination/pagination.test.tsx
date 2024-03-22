/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// mock svgs to reduce snapshot noise
vi.mock('@hashicorp/flight-icons/svg-react/chevron-left-16', () => ({
	IconChevronLeft16: () => <svg>IconChevronLeft16</svg>,
}))
vi.mock('@hashicorp/flight-icons/svg-react/chevron-right-16', () => ({
	IconChevronRight16: () => <svg>IconChevronRight16</svg>,
}))

import Pagination from './index'
import { generateTruncatedList } from './helpers'

describe('Pagination', () => {
	// Silence console.error
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => void 1)
	})
	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('props validation', () => {
		it('disallows zero or negative pageSize', () => {
			expect(() => {
				render(<Pagination totalItems={103} pageSize={-10} />)
			}).toThrowErrorMatchingInlineSnapshot(
				`[Error: Pagination: pageSize is required, but was not specified. Please try passing a non-zero, positive value such as \`10\`.]`
			)
		})

		it('disallows negative totalItems', () => {
			expect(() => {
				render(<Pagination totalItems={-1} pageSize={10} />)
			}).toThrowErrorMatchingInlineSnapshot(
				`[Error: Pagination: totalItems is required, but was not specified. Please try passing a positive value such as \`103\`.]`
			)
		})

		it('disallows zero or negative page', () => {
			expect(() => {
				render(<Pagination totalItems={100} pageSize={10} page={0} />)
			}).toThrowErrorMatchingInlineSnapshot(
				`[Error: Pagination: page must be a non-zero, positive number. Please try passing a value such as \`1\`.]`
			)
		})
	})

	it('should match the snapshot', () => {
		const { container } = render(
			<Pagination totalItems={103} pageSize={10}>
				<Pagination.Info />
				<Pagination.Nav />
				<Pagination.SizeSelector sizes={[10, 30, 50]} />
			</Pagination>
		)

		expect(container).toMatchInlineSnapshot(`
		<div>
		  <div
		    class="_pagination_0c87fd"
		  >
		    <div
		      class="_info_0c87fd"
		    >
		      1
		       - 
		      10
		       of 103
		    </div>
		    <nav
		      aria-label="Pagination navigation"
		      class="_nav_0c87fd"
		    >
		      <button
		        aria-label="Previous"
		        class="_arrow_0c87fd _control_0c87fd _prev_0c87fd"
		        disabled=""
		      >
		        <svg>
		          IconChevronLeft16
		        </svg>
		        <span
		          class="_label_0c87fd"
		        >
		          Previous
		        </span>
		      </button>
		      <button
		        aria-label="Next"
		        class="_arrow_0c87fd _control_0c87fd _next_0c87fd"
		      >
		        <svg>
		          IconChevronRight16
		        </svg>
		        <span
		          class="_label_0c87fd"
		        >
		          Next
		        </span>
		      </button>
		    </nav>
		    <div
		      class="_size-selector_0c87fd"
		    >
		      <label
		        class="_label_0c87fd"
		      >
		        Items per page
		        <select
		          class="_select_0c87fd"
		        >
		          <option
		            selected=""
		            value="10"
		          >
		            10
		          </option>
		          <option
		            value="30"
		          >
		            30
		          </option>
		          <option
		            value="50"
		          >
		            50
		          </option>
		        </select>
		      </label>
		    </div>
		  </div>
		</div>
	`)
	})

	it('should render an active button', () => {
		// page 3 is active
		const { queryByRole } = render(
			<Pagination totalItems={103} pageSize={10} page={3}>
				<Pagination.Info />
				<Pagination.Nav type="numbered" />
				<Pagination.SizeSelector sizes={[10, 30, 50]} />
			</Pagination>
		)

		// button for page 3 should have aria-current="page"
		expect(queryByRole('button', { name: '3' })).toHaveAttribute(
			'aria-current',
			'page'
		)
	})

	describe('compact nav', () => {
		it('onPageChange is called with the correct index', async () => {
			const onPageChange = vi.fn()
			const { queryAllByRole } = render(
				<Pagination totalItems={103} pageSize={10} onPageChange={onPageChange}>
					<Pagination.Info />
					<Pagination.Nav />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			const nextButton = queryAllByRole('button').slice(-1)[0]

			// Page 1 is active by default
			await userEvent.click(nextButton) // Page 2 is now active
			expect(onPageChange).toHaveBeenNthCalledWith(1, 2)
		})

		it('onPageSizeChange is called with the correct size, and resets the page to 1', async () => {
			// mimic a consumer's useState()

			// eslint-disable-next-line prefer-const
			let [page, setPage] = [3, vi.fn((newPage) => (page = newPage))]
			// eslint-disable-next-line prefer-const
			let [pageSize, setPageSize] = [
				10,
				vi.fn((newPageSize) => (pageSize = newPageSize)),
			]

			const { queryAllByRole } = render(
				<Pagination
					page={page}
					pageSize={pageSize}
					totalItems={103}
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
				>
					<Pagination.Info />
					<Pagination.Nav />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			const select = queryAllByRole('combobox')[0]

			await userEvent.selectOptions(select, '30') // Page size: 10 -> 30
			expect(setPageSize).toHaveBeenNthCalledWith(1, 30)
			expect(setPage).toHaveBeenNthCalledWith(1, 1) // Page should be reset to 1
		})
	})

	describe('truncated nav', () => {
		it('should display ellipses', async () => {
			const { queryAllByText } = render(
				<Pagination totalItems={103} pageSize={10}>
					<Pagination.Info />
					<Pagination.Nav type="truncated" />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			// [(1),2,3,4,...,10,11]
			expect(queryAllByText('...')).toHaveLength(1)
		})
	})

	describe('numeric nav', () => {
		it('should display the correct number of page numbers', () => {
			const { queryAllByRole } = render(
				<Pagination totalItems={103} pageSize={10}>
					<Pagination.Info />
					<Pagination.Nav type="numbered" />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			// drop the first and last buttons (prev/next)
			const pageNumbers = queryAllByRole('button').slice(1, -1)

			expect(pageNumbers).toHaveLength(Math.ceil(103 / 10))
		})
	})

	describe('Pagination.Info', () => {
		it.each([
			[103, 30, 3, '61 - 90 of 103'],
			[55, 10, 1, '1 - 10 of 55'],
		])(
			'should display the correct info',
			(totalItems, pageSize, page, text) => {
				const { queryByText } = render(
					<Pagination totalItems={totalItems} pageSize={pageSize} page={page}>
						<Pagination.Info />
					</Pagination>
				)

				expect(queryByText(text)).toBeInTheDocument()
			}
		)
	})
})

describe('generateTruncatedList', () => {
	let rawlist: number[]

	beforeEach(() => {
		rawlist = Array.from({ length: 103 }, (_, i) => i + 1)
	})

	it.each([
		[1, [1, 2, 3, 4, 'ellipsis', 102, 103]],
		[4, [1, 'ellipsis', 3, 4, 5, 'ellipsis', 103]],
		[101, [1, 2, 'ellipsis', 100, 101, 102, 103]],
	])(
		'should return a list of numbers and ellipses, given a currentPage: "%s"',
		(currentPage, output) => {
			expect(generateTruncatedList(rawlist, currentPage)).toEqual(output)
		}
	)
})
