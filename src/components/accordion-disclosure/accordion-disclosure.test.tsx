/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, fireEvent } from '@testing-library/react'
import AccordionDisclosure from '.'

vi.mock('next/router', () => ({
	useRouter() {
		return {
			events: {
				on: vi.fn(),
				off: vi.fn(),
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

		expect(buttons[0].parentElement).not.toHaveClass(/isNested/)
		expect(buttons[1].parentElement).toHaveClass(/isNested/)
		expect(buttons[2].parentElement).toHaveClass(/isNested/)
	})

	it('handles "isOpen" state with correct aria attributes', () => {
		const { queryByRole } = render(
			<AccordionDisclosure
				title={'Item 1'}
				description={'what a lovely accordion item'}
			>
				I am an accordion item
			</AccordionDisclosure>
		)
		const button = queryByRole('button')

		expect(button.parentElement).not.toHaveClass(/isOpen/)
		expect(button).toHaveAttribute('aria-expanded', 'false')

		fireEvent(
			button,
			new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
			})
		)

		expect(button.parentElement).toHaveClass(/isOpen/)
		expect(button).toHaveAttribute('aria-expanded', 'true')
	})
})
