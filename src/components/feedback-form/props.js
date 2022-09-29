const baseProps = {
	questions: {
		type: 'array',
		description: 'The list of questions which are displayed to the user.',
		required: true,
		properties: [
			{
				type: 'object',
				properties: {
					id: {
						type: 'string',
						required: true,
						description:
							'A unique ID for the question. Referenced in other questions to control the flow of the form.',
					},
					type: {
						type: 'string',
						options: ['choice', 'text'],
						required: true,
						description:
							'The type of question being declared, controls what props are needed and how the question is rendered.',
					},
					labelIcon: {
						type: 'React.Element',
						description: 'Optional icon that precedes the label',
					},
					label: {
						type: 'string',
						description:
							'Text displayed immediately above the question input in bold.',
						required: true,
					},
					labelSecondary: {
						type: 'string',
						description: 'Optional un-bolded text that follows the main label',
					},
					buttonText: {
						type: 'string',
						description:
							'If type `text`, the text displayed on the submit button.',
					},
				},
			},
		],
	},
	finishedText: {
		type: 'React.Element',
		description: 'Text rendered in thank you message when form is submitted',
	},
	onQuestionSubmit: {
		type: 'function',
		description: 'Called each time a question is submitted',
	},
}

const choiceQuestionProps = {
	answers: {
		type: 'array',
		description:
			'Required if type is `choice`. Renders a button for each option.',
		properties: [
			{
				type: 'object',
				properties: {
					value: { type: 'string' },
					display: { type: 'string' },
					nextQuestion: {
						type: 'string',
						description:
							'The `id` of the next question to render. If none, the form will transition to finished.',
					},
					icon: {
						type: 'React.Element',
					},
				},
			},
		],
	},
}

const textQuestionProps = {
	value: { type: 'string' },
	display: { type: 'string' },
	nextQuestion: {
		type: 'string',
		description:
			'The `id` of the next question to render. If none, the form will transition to finished.',
	},
	icon: {
		type: 'React.Element',
	},
	optional: {
		type: 'boolean',
		description: 'If true, response is not required to move on to next step',
	},
}

module.exports = { baseProps, choiceQuestionProps, textQuestionProps }
