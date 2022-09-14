import { IconThumbsDown16 } from '@hashicorp/flight-icons/svg-react/thumbs-down-16'
import { IconThumbsUp16 } from '@hashicorp/flight-icons/svg-react/thumbs-up-16'
import { FeedbackFormProps } from 'components/feedback-form/types'

export const feedbackQuestions: FeedbackFormProps = {
	questions: [
		{
			id: 'helpful',
			type: 'choice',
			label: 'Was this tutorial helpful?',
			answers: [
				{
					icon: (
						<IconThumbsUp16 color="var(--token-color-foreground-primary)" />
					),
					value: 'yes',
					display: 'Yes',
					nextQuestion: 'reasonForVisit',
				},
				{
					icon: (
						<IconThumbsDown16 color="var(--token-color-foreground-primary)" />
					),
					value: 'no',
					display: 'No',
					nextQuestion: 'suggestedImprovements',
				},
			],
		},
		{
			id: 'reasonForVisit',
			type: 'text',
			labelIcon: <IconThumbsUp16 color="var(--token-color-foreground-faint)" />,
			label: 'Why did you visit this tutorial?',
			optional: true,
			buttonText: 'Submit answer',
		},
		{
			id: 'suggestedImprovements',
			type: 'text',
			labelIcon: <IconThumbsUp16 />,
			label: 'We want to hear from you.',
			labelSecondary: 'How could this tutorial be more helpful?',
			buttonText: 'Submit answer',
		},
	],
	onQuestionSubmit: () => console.log('submit'),
	thankYouText: 'Thank you! Your feedback will help us improve our websites.',
}
