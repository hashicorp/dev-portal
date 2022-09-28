import { IconThumbsDown16 } from '@hashicorp/flight-icons/svg-react/thumbs-down-16'
import { IconThumbsUp16 } from '@hashicorp/flight-icons/svg-react/thumbs-up-16'
import type { FeedbackFormProps } from 'components/feedback-form/types'
import FeedbackForm from 'components/feedback-form'
import s from './feedback-panel.module.css'

/**
 * Largely copied from: https://github.com/hashicorp/learn/blob/master/components/feedback-panel/index.jsx
 */

async function recordFeedback(responses, sessionId) {
	const body = {
		responses: responses.reduce(
			(obj, { id, value }) =>
				Object.assign(obj, {
					[id]: value,
				}),
			{}
		),
		sessionId,
		timestamp: new Date(),
	}

	try {
		const payload = {
			...body,
			page: document.location.pathname,
		}

		const apiRequest = async () => {
			const res = await fetch('/api/tutorial-feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (res.status === 204) {
				console.log('done')
			} else {
				console.warn('unexpected result from feedback api')
			}
		}

		await apiRequest()
	} catch (e) {
		console.warn(e)
	}
}

const questions: FeedbackFormProps['questions'] = [
	{
		id: 'helpful',
		type: 'choice',
		label: 'Was this tutorial helpful?',
		answers: [
			{
				icon: <IconThumbsUp16 color="var(--token-color-foreground-faint)" />,
				value: 'yes',
				display: 'Yes',
				nextQuestion: 'reasonForVisit',
			},
			{
				icon: <IconThumbsDown16 color="var(--token-color-foreground-faint)" />,
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
		label: 'We want to hear from you.',
		labelSecondary: 'Why did you visit this tutorial?',
		buttonText: 'Submit',
		optional: true,
	},
	{
		id: 'suggestedImprovements',
		type: 'text',
		labelIcon: <IconThumbsDown16 color="var(--token-color-foreground-faint)" />,
		label: 'We want to hear from you.',
		labelSecondary: 'How could this tutorial be more helpful?',
		buttonText: 'Submit',
		optional: true,
	},
]

export function FeedbackPanel() {
	return (
		<div className={s.root}>
			<FeedbackForm
				questions={questions}
				onQuestionSubmit={recordFeedback}
				finishedText={
					<>Thank you! Your feedback will help us improve our websites.</>
				}
			/>
		</div>
	)
}

export default FeedbackPanel
