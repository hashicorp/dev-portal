/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { MdxInlineAlert } from '.'

const TEST_DATA = {
	customTitle: 'Custom title',
	errors: {
		invalidType:
			"[MdxInlineAlert]: Invalid alert type passed, 'doughnut'. Please pass one of: tip | highlight | note | warning",
		noChildren:
			'[MdxInlineAlert]: No `children` found, please pass a description body',
	},
	tip: {
		title: 'Tip',
		body: 'I am a tip alert',
	},
	highlight: {
		title: 'Tip',
		body: 'I am a highlight alert',
	},
	note: {
		title: 'Note',
		body: 'I am a note alert',
	},
	warning: {
		title: 'Warning',
		body: 'I am a warning alert',
	},
}

describe('`MdxInlineAlert` Component', () => {
	it('renders default tip without error', () => {
		const data = TEST_DATA['tip']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert>{data.body}</MdxInlineAlert>
		)
		expect(queryByTestId('icon')).toBeInTheDocument()
		expect(queryByText(data.title)).toBeInTheDocument()
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default highlight without error', () => {
		const data = TEST_DATA['highlight']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert type="highlight">{data.body}</MdxInlineAlert>
		)
		expect(queryByTestId('icon')).toBeInTheDocument()
		expect(queryByText(data.title)).toBeInTheDocument()
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default note without error', () => {
		const data = TEST_DATA['note']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert type="note">{data.body}</MdxInlineAlert>
		)
		expect(queryByTestId('icon')).toBeInTheDocument()
		expect(queryByText(data.title)).toBeInTheDocument()
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default warning without error', () => {
		const data = TEST_DATA['warning']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert type="warning">{data.body}</MdxInlineAlert>
		)
		expect(queryByTestId('icon')).toBeInTheDocument()
		expect(queryByText(data.title)).toBeInTheDocument()
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders a custom title', () => {
		const { queryByText } = render(
			<MdxInlineAlert title={TEST_DATA.customTitle}>
				{TEST_DATA['tip'].body}
			</MdxInlineAlert>
		)
		expect(queryByText(TEST_DATA.customTitle)).toBeInTheDocument()
	})

	it('renders error fallback when children are empty', () => {
		const { getByText } = render(<MdxInlineAlert>{''}</MdxInlineAlert>)

		// Should render the error fallback UI instead of throwing
		expect(getByText('Alert Error')).toBeInTheDocument()
		expect(
			getByText(
				'There was an error rendering this alert. Please check the alert configuration.'
			)
		).toBeInTheDocument()
	})

	it('renders error fallback when type is invalid', () => {
		const invalidType = 'doughnut' as 'tip' | 'highlight' | 'note' | 'warning'
		const { getByText } = render(
			<MdxInlineAlert type={invalidType}>I am an MdxInlineAlert</MdxInlineAlert>
		)

		// Should render the error fallback UI instead of throwing
		expect(getByText('Alert Error')).toBeInTheDocument()
		expect(
			getByText(
				'There was an error rendering this alert. Please check the alert configuration.'
			)
		).toBeInTheDocument()
	})

	it('renders multiple children', () => {
		const { getByText } = render(
			<MdxInlineAlert>
				<p>This may render multiple children.</p>
				<p>This should get multiple children.</p>
			</MdxInlineAlert>
		)

		expect(getByText('This may render multiple children.')).toBeInTheDocument()
		expect(getByText('This should get multiple children.')).toBeInTheDocument()
	})
})
