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
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default highlight without error', () => {
		const data = TEST_DATA['highlight']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert type="highlight">{data.body}</MdxInlineAlert>
		)
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default note without error', () => {
		const data = TEST_DATA['note']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert type="note">{data.body}</MdxInlineAlert>
		)
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default warning without error', () => {
		const data = TEST_DATA['warning']
		const { queryByText, queryByTestId } = render(
			<MdxInlineAlert type="warning">{data.body}</MdxInlineAlert>
		)
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
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

	it('throws when children are not passed', () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		expect(() => render(<MdxInlineAlert />)).toThrowError(
			TEST_DATA.errors.noChildren
		)
	})

	it('throws when type is invalid', () => {
		expect(() =>
			render(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				<MdxInlineAlert type="doughnut">I am an MdxInlineAlert</MdxInlineAlert>
			)
		).toThrowError(TEST_DATA.errors.invalidType)
	})

	it('renders multiple children', () => {
		expect(() =>
			render(
				<MdxInlineAlert>
					<p> Liquorice cake marzipan danish brownie</p>
					<p>Lollipop gingerbread bear claw muffin croissant</p>
				</MdxInlineAlert>
			)
		).not.toThrowError()
	})
})
