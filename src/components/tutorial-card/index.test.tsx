/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { TutorialCard } from './tutorial-card'

const mockTutorialCardData = {
	description: 'This is a great tutorial, you must read',
	duration: '10min',
	hasInteractiveLab: false,
	hasVideo: false,
	heading: 'The best tutorial',
	url: '/best-tutorial',
	productsUsed: [],
}

describe('Tutorial Card eyebrow slot', () => {
	it('Shows base read time', () => {
		const { queryByText } = render(<TutorialCard {...mockTutorialCardData} />)

		const readTime = queryByText('10min')
		expect(readTime).toBeInTheDocument()
	})

	it('Renders eyebrow slot content when passed', () => {
		const content = 'Eyebrow content'
		const { queryByText } = render(
			<TutorialCard {...mockTutorialCardData} eyebrowSlot={content} />
		)

		const readTime = queryByText(content)
		expect(readTime).toBeInTheDocument()
	})
})
