import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Pagination from './index'

describe('Pagination', () => {
	describe('compact nav', () => {
		it('onSelectPage is called with the correct index', async () => {
			const onSelectPage = jest.fn()
			const { queryAllByRole } = render(
				<Pagination
					totalItems={103}
					itemsPerPage={10}
					onSelectPage={onSelectPage}
				>
					<Pagination.Info />
					<Pagination.Nav />
					<Pagination.SizeSelector sizes={[10, 30, 50]} />
				</Pagination>
			)

			const nextButton = queryAllByRole('button').slice(-1)[0]

			// Page 1 is active by default
			await userEvent.click(nextButton) // Page 2 is now active
			expect(onSelectPage).toHaveBeenNthCalledWith(1, 2)
			await userEvent.click(nextButton) // Page 3 is now active
			expect(onSelectPage).toHaveBeenNthCalledWith(2, 3)
		})
	})

	describe('truncated nav', () => {
		it('should display ellipses', async () => {
			const { queryAllByText, queryAllByRole } = render(
				<Pagination totalItems={103} itemsPerPage={10}>
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
				<Pagination totalItems={103} itemsPerPage={10}>
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
})
