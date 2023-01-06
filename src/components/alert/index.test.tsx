import { render } from '@testing-library/react'
import Alert from '.'

const TEST_DATA = {
	customTitle: 'Custom title',
	errors: {
		invalidType:
			'[Alert]: Invalid alert type passed. Please pass one of: tip | highlight | note | warning',
		noChildren: '[Alert]: No `children` found, please pass a description body',
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

describe('Alert Component', () => {
	it('renders default tip withour error', () => {
		const data = TEST_DATA['tip']
		const { queryByText, queryByTestId } = render(<Alert>{data.body}</Alert>)
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default highlight withour error', () => {
		const data = TEST_DATA['highlight']
		const { queryByText, queryByTestId } = render(
			<Alert type="highlight">{data.body}</Alert>
		)
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default note withour error', () => {
		const data = TEST_DATA['note']
		const { queryByText, queryByTestId } = render(
			<Alert type="note">{data.body}</Alert>
		)
		// icon renders
		expect(queryByTestId('icon')).toBeInTheDocument()
		// default title renders
		expect(queryByText(data.title)).toBeInTheDocument()
		// body text renders
		expect(queryByText(data.body)).toBeInTheDocument()
	})

	it('renders default warning withour error', () => {
		const data = TEST_DATA['warning']
		const { queryByText, queryByTestId } = render(
			<Alert type="warning">{data.body}</Alert>
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
			<Alert title={TEST_DATA.customTitle}>{TEST_DATA['tip'].body}</Alert>
		)
		expect(queryByText(TEST_DATA.customTitle)).toBeInTheDocument()
	})

	it('throws when children are not passed', () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		expect(() => render(<Alert />)).toThrowError(TEST_DATA.errors.noChildren)
	})

	it('throws when type is invalid', () => {
		expect(() =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			render(<Alert type="doughnut">I am an alert</Alert>)
		).toThrowError(TEST_DATA.errors.invalidType)
	})
})
