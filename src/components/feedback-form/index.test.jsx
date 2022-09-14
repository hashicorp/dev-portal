import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeedbackForm from '.'

const basicQuestion = [
	{
		id: 'myQuestion',
		type: 'text',
		text: 'This is a question',
		buttonText: 'Submit',
	},
]

const multipleQuestions = [
	{
		id: 'myChoice',
		type: 'choice',
		text: 'What do you think?',
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
		text: 'This is a question',
		buttonText: 'Submit',
	},
]

describe('FeedbackForm', () => {
	test('basic question', async () => {
		render(<FeedbackForm questions={basicQuestion} finished="All done!" />)

		userEvent.type(screen.getByRole('textbox'), 'answer')

		userEvent.click(screen.getByRole('button'), { type: 'submit' })

		const finished = await screen.findByText('All done!')

		expect(finished).not.toBeNull()
	})

	test('multiple questions', async () => {
		render(<FeedbackForm questions={multipleQuestions} finished="All done!" />)

		userEvent.click(screen.getByText('Yes'))

		await screen.findByRole('textbox')

		userEvent.type(screen.getByRole('textbox'), 'answer')

		userEvent.click(screen.getByRole('button'), { type: 'submit' })

		const finished = await screen.findByText('All done!')

		expect(finished).not.toBeNull()
	})

	test('choice question tracking attributes', async () => {
		const { container } = render(
			<FeedbackForm questions={multipleQuestions} finished="All done!" />
		)

		const yesButton = container.querySelector(
			'[data-heap-track="feedback-form-button-myChoice-yes"]'
		)

		const noButton = container.querySelector(
			'[data-heap-track="feedback-form-button-myChoice-no"]'
		)

		expect(yesButton).not.toBeNull()
		expect(noButton).not.toBeNull()
	})

	test('multiple questions with different path', async () => {
		render(<FeedbackForm questions={multipleQuestions} finished="All done!" />)

		userEvent.click(screen.getByText('No'))

		const finished = await screen.findByText('All done!')

		expect(finished).not.toBeNull()
	})

	test('onQuestionSubmit callback', async () => {
		const onQuestionSubmit = jest.fn()
		render(
			<FeedbackForm
				questions={multipleQuestions}
				finished="All done!"
				onQuestionSubmit={onQuestionSubmit}
			/>
		)

		userEvent.click(screen.getByText('Yes'))

		await screen.findByRole('textbox')

		userEvent.type(screen.getByRole('textbox'), 'answer')

		userEvent.click(screen.getByRole('button'), { type: 'submit' })

		await screen.findByText('All done!')

		expect(onQuestionSubmit).toHaveBeenCalledTimes(2)

		expect(onQuestionSubmit.mock.calls.map(([firstArg]) => firstArg))
			.toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "id": "myChoice",
            "value": "yes",
          },
        ],
        Array [
          Object {
            "id": "myChoice",
            "value": "yes",
          },
          Object {
            "id": "myQuestion",
            "value": "answer",
          },
        ],
      ]
    `)
	})
})
