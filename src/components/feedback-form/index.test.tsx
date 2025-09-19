/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import FeedbackForm from '.'
import type { FeedbackQuestion } from './types'

const basicQuestion: FeedbackQuestion[] = [
	{
		id: 'myQuestion',
		type: 'text',
		label: 'This is a question',
		buttonText: 'Submit',
	},
]

const multipleQuestions: FeedbackQuestion[] = [
	{
		id: 'myChoice',
		type: 'choice',
		label: 'What do you think?',
		answers: [
			{
				value: 'yes',
				display: 'Yes',
				nextQuestion: 'myQuestion',
			},
			{
				value: 'no',
				display: 'No',
			},
		],
	},
	{
		id: 'myQuestion',
		type: 'text',
		label: 'This is a question',
		buttonText: 'Submit',
	},
]

describe('FeedbackForm', () => {
	test('basic question', async () => {
		const onQuestionSubmit = vi.fn()
		render(
			<FeedbackForm
				questions={basicQuestion}
				finishedText="All done!"
				onQuestionSubmit={onQuestionSubmit}
			/>
		)

		await act(async () => {
			await userEvent.type(screen.getByRole('textbox'), 'answer')
		});

		await act(async () => {
			userEvent.click(screen.getByText('Submit'))
		});

		await screen.findByText('All done!')
	})

	test('multiple questions', async () => {
		render(
			<FeedbackForm
				questions={multipleQuestions}
				finishedText="All done!"
				onQuestionSubmit={() => null}
			/>
		)

		await act(async () => {
			await userEvent.click(screen.getByText('Yes'))
		});

		await screen.findByRole('textbox')

		await act(async () => {
			await userEvent.type(screen.getByRole('textbox'), 'answer')
		});

		await act(async () => {
			userEvent.click(screen.getByText('Submit'))
		});

		await screen.findByText('All done!')
	})

	test('choice question tracking attributes', async () => {
		render(
			<FeedbackForm
				questions={multipleQuestions}
				finishedText="All done!"
				onQuestionSubmit={() => null}
			/>
		)

		screen.getByText('Yes')
		screen.getByText('No')
	})

	test('multiple questions with different path', async () => {
		render(
			<FeedbackForm
				questions={multipleQuestions}
				finishedText="All done!"
				onQuestionSubmit={() => null}
			/>
		)

		userEvent.click(screen.getByText('No'))

		await screen.findByText('All done!')
	})

	test('onQuestionSubmit callback', async () => {
		const onQuestionSubmit = vi.fn()
		render(
			<FeedbackForm
				questions={multipleQuestions}
				finishedText="All done!"
				onQuestionSubmit={onQuestionSubmit}
			/>
		)

		userEvent.click(screen.getByText('Yes'))

		await screen.findByRole('textbox')

		await userEvent.type(screen.getByRole('textbox'), 'answer')

		userEvent.click(screen.getByText('Submit'))

		await screen.findByText('All done!')

		expect(onQuestionSubmit).toHaveBeenCalledTimes(2)

		expect(onQuestionSubmit.mock.calls.map(([firstArg]) => firstArg))
			.toMatchInlineSnapshot(`
				[
				  [
				    {
				      "id": "myChoice",
				      "value": "yes",
				    },
				  ],
				  [
				    {
				      "id": "myChoice",
				      "value": "yes",
				    },
				    {
				      "id": "myQuestion",
				      "value": "answer",
				    },
				  ],
				]
			`)
	})
})
