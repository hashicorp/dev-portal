import { render } from '@testing-library/react'
import AccordionDisclosure from '.'

jest.mock('next/router', () => ({
	useRouter() {
		return {
			events: {
				on: jest.fn(),
				off: jest.fn(),
			},
		}
	},
}))

describe('AccordionDisclosure', () => {
	it('renders without errors', () => {
		const { getByRole, queryByText } = render(
			<AccordionDisclosure title={'A Title'} description={'A Description'}>
				Child text
			</AccordionDisclosure>
		)

		// button renders
		expect(getByRole('button')).toBeInTheDocument()
		// title renders
		expect(queryByText('A Title')).toBeInTheDocument()
		// description renders
		expect(queryByText('A Description')).toBeInTheDocument()
	})

	it('applies nested class to all nested AccordionDisclosure', () => {
		const wrapper = ({ children }) => {
			return (
				<AccordionDisclosure
					title={'GrandParent Title'}
					description={'GrandParentParent Description'}
				>
					<AccordionDisclosure
						title={'Parent Title'}
						description={'Parent Description'}
					>
						{children}
					</AccordionDisclosure>
				</AccordionDisclosure>
			)
		}

		const { queryAllByRole } = render(
			<AccordionDisclosure title={'A Title'} description={'A Description'}>
				Child text
			</AccordionDisclosure>,
			{ wrapper }
		)

		// best effort to query for plain divs rendered by Disclosure
		const buttons = queryAllByRole('button')

		expect(buttons[0].parentElement).not.toHaveClass('nested')
		expect(buttons[1].parentElement).toHaveClass('nested')
		expect(buttons[2].parentElement).toHaveClass('nested')
	})
})
