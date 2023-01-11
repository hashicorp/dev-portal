import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// mock svgs to reduce snapshot noise
jest.mock('@hashicorp/flight-icons/svg-react/chevron-left-16', () => ({
	IconChevronLeft16: () => <svg>IconChevronLeft16</svg>,
}))
jest.mock('@hashicorp/flight-icons/svg-react/chevron-right-16', () => ({
	IconChevronRight16: () => <svg>IconChevronRight16</svg>,
}))

import Pagination from './index'
import { generateTruncatedList } from './helpers'

describe('Pagination', () => {
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
		    class="pagination"
		  >
		    <div
		      class="info"
		    >
		      1
		       - 
		      10
		       of 103
		    </div>
		    <nav
		      aria-label="Pagination navigation"
		      class="nav"
		    >
		      <button
		        aria-label="Previous page"
		        class="arrow control prev"
		        disabled=""
		      >
		        <svg>
		          IconChevronLeft16
		        </svg>
		        <span
		          aria-hidden="true"
		          class="label"
		        >
		          Previous
		        </span>
		      </button>
		      <button
		        aria-label="Next page"
		        class="arrow control next"
		      >
		        <svg>
		          IconChevronRight16
		        </svg>
		        <span
		          aria-hidden="true"
		          class="label"
		        >
		          Next
		        </span>
		      </button>
		    </nav>
		    <div
		      class="size-selector"
		    >
		      <label
		        class="label"
		      >
		        Items per page
		        <select
		          class="select"
		        >
		          <option
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

	describe('compact nav', () => {
		it('onPageChange is called with the correct index', async () => {
			const onPageChange = jest.fn()
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
			await userEvent.click(nextButton) // Page 3 is now active
			expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
		})

		it('onPageSizeChange is called with the correct size, and resets the page to 1', async () => {
			const onPageChange = jest.fn()
			const onPageSizeChange = jest.fn()
			const { queryAllByRole } = render(
				<Pagination
					totalItems={103}
					pageSize={10}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
				>
					<Pagination.Info />
					<Pagination.Nav />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			const select = queryAllByRole('combobox')[0]

			await userEvent.selectOptions(select, '30') // Page size is now 30
			expect(onPageSizeChange).toHaveBeenNthCalledWith(1, 30)
			expect(onPageChange).toHaveBeenNthCalledWith(1, 1)

			// selecting the same page size value should not trigger the two callbacks
			await userEvent.selectOptions(select, '30')
			expect(onPageSizeChange).toHaveBeenCalledTimes(1)
			expect(onPageChange).toHaveBeenCalledTimes(1)

			await userEvent.selectOptions(select, '50')
			expect(onPageSizeChange).toHaveBeenNthCalledWith(2, 50)
			expect(onPageChange).toHaveBeenNthCalledWith(2, 1)
		})
	})

	describe('truncated nav', () => {
		it('should display ellipses', async () => {
			const { queryAllByText, queryAllByRole } = render(
				<Pagination totalItems={103} pageSize={10}>
					<Pagination.Info />
					<Pagination.Nav type="truncated" />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			const nextButton = queryAllByRole('button').slice(-1)[0]

			// [(1),2,3,4,...,10,11]
			expect(queryAllByText('...')).toHaveLength(1)
			await userEvent.click(nextButton) // [1,(2),3,4,...,10,11]
			await userEvent.click(nextButton) // [1,2,(3),4,...,10,11]
			await userEvent.click(nextButton) // [1,...,3,(4),5,...,11]

			expect(queryAllByText('...')).toHaveLength(2)
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
