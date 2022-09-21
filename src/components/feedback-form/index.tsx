import { createContext, useMemo, useState, useRef, MouseEvent } from 'react'
import shortid from 'shortid'
import {
	type FeedbackFormContext as FeedbackFormContextType,
	type FeedbackQuestion,
	type FeedbackFormProps,
	type FeedbackResponse,
	FeedbackFormStatus,
} from './types'
import { Question, Finished } from './components'

/**
 * Largely copied from: https://github.com/hashicorp/react-components/tree/main/packages/feedback-form
 */

const MAX_TRANSITION_DURATION_MS = 200

const wait = (delay: number) =>
	new Promise((resolve) => setTimeout(resolve, delay))

export const FeedbackFormContext = createContext<FeedbackFormContextType>({})

export default function FeedbackForm({
	questions,
	finishedText,
	onQuestionSubmit = () => void 0,
}: FeedbackFormProps): React.ReactElement {
	const [status, setStatus] = useState<FeedbackFormStatus>(
		FeedbackFormStatus.inProgress
	)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [responses, setResponses] = useState<
		{
			id: string
			value: string
		}[]
	>([])
	const [activeQuestion, setActiveQuestion] = useState(questions[0].id)
	const sessionId = useRef<string | undefined>()

	const getSessionId = () => {
		if (!sessionId.current) {
			sessionId.current = shortid.generate() as string
		}
		return sessionId.current
	}

	const contextValue: FeedbackFormContextType = useMemo(
		() => ({
			isTransitioning,
			activeQuestion,
			submitQuestion(
				e: MouseEvent<HTMLElement>,
				answer: FeedbackResponse & { nextQuestion?: string }
			) {
				e.preventDefault()

				const newResponses = [
					...responses,
					{ id: answer.id, value: answer.value },
				]

				setResponses(newResponses)

				// Set a transitioning state so we can disable buttons while submission is happening
				setIsTransitioning(true)
				// Set a max transition time by using Promise.race to ensure there isn't a delay in user interaction
				Promise.race([
					onQuestionSubmit(newResponses, getSessionId()),
					wait(MAX_TRANSITION_DURATION_MS),
				]).finally(() => {
					setIsTransitioning(false)
					if (answer.nextQuestion) {
						setActiveQuestion(answer.nextQuestion)
					} else {
						setStatus(FeedbackFormStatus.finished)
					}
				})
			},
		}),
		[activeQuestion, responses]
	)

	return (
		<FeedbackFormContext.Provider value={contextValue}>
			<form id="feedback-panel">
				{status === FeedbackFormStatus.inProgress
					? questions.map((question: FeedbackQuestion, idx) => (
							<Question
								key={question.id}
								question={question}
								animate={idx !== 0}
							/>
					  ))
					: null}
			</form>
			{status === FeedbackFormStatus.finished ? (
				<Finished text={finishedText} />
			) : null}
		</FeedbackFormContext.Provider>
	)
}
