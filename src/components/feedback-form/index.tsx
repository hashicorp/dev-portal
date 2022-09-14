import React, {
	useContext,
	createContext,
	useMemo,
	useState,
	useRef,
	MouseEvent,
} from 'react'
import shortid from 'shortid'
import Button from 'components/button'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'

import {
	type FeedbackFormContext as FeedbackFormContextType,
	type FeedbackQuestion,
	type FeedbackFormProps,
	type FeedbackQuestionChoiceAnswer,
	type FeedbackResponse,
	FeedbackFormStatus,
} from './types'

import s from './feedback-form.module.css'

/**
 * Largely copied from: https://github.com/hashicorp/react-components/tree/main/packages/feedback-form
 */

const MAX_TRANSITION_DURATION_MS = 200

const wait = (delay: number) =>
	new Promise((resolve) => setTimeout(resolve, delay))

const FeedbackFormContext = createContext<FeedbackFormContextType>({})

const Question: React.FC<FeedbackQuestion> = (props: FeedbackQuestion) => {
	const { id, type, label, labelSecondary, labelIcon } = props
	const [inputValue, setInputValue] = useState('')
	const feedbackContext = useContext(FeedbackFormContext)

	if (feedbackContext.activeQuestion !== id) {
		return null
	}

	let inputs: React.ReactNode

	switch (type) {
		case 'choice': {
			const { answers } = props
			inputs = (
				<div className={s.buttonWrapper}>
					{answers.map(
						({
							icon,
							display,
							value,
							nextQuestion,
						}: FeedbackQuestionChoiceAnswer) => (
							<Button
								type={nextQuestion ? 'button' : 'submit'}
								data-testid={nextQuestion ? null : 'submit-button'}
								disabled={feedbackContext.isTransitioning}
								aria-label={display}
								key={display}
								text={display}
								size="small"
								color="secondary"
								onClick={(e: MouseEvent<HTMLElement>) =>
									feedbackContext.submitQuestion(e, { id, value, nextQuestion })
								}
								icon={icon}
								data-heap-track={`feedback-form-button-${id}-${value}`}
							/>
						)
					)}
				</div>
			)

			break
		}
		case 'text': {
			const { optional, buttonText, nextQuestion } = props
			const isButtonDisabled =
				!optional && (inputValue === '' || feedbackContext.isTransitioning)

			inputs = (
				<>
					<div className={s.textAreaContainer}>
						<textarea
							id={id}
							value={inputValue}
							onChange={(e) => setInputValue(e.currentTarget.value)}
							className={s.textArea}
							placeholder="Your feedback..."
						/>
						{optional && <span className={s.optionalText}>(optional)</span>}
					</div>
					<Button
						className={s.submitButton}
						type={nextQuestion ? 'button' : 'submit'}
						data-testid={nextQuestion ? null : 'submit-button'}
						aria-label={buttonText}
						text={buttonText}
						disabled={isButtonDisabled}
						onClick={(e: MouseEvent<HTMLElement>) =>
							feedbackContext.submitQuestion(e, { id, value: inputValue })
						}
					/>
				</>
			)

			break
		}
	}

	return (
		<div className={s.question}>
			<label htmlFor={id} className={s.labelWrapper}>
				{labelIcon && <div className={s.labelIcon}>{labelIcon}</div>}
				<span className={s.label}>
					<strong>{label}</strong>
					{labelSecondary ? ` ${labelSecondary}` : ''}
				</span>
			</label>
			{inputs}
		</div>
	)
}

const Finished: React.FC<{ text: string }> = ({ text }: { text: string }) => (
	<div className={s.finished}>
		<IconCheckCircle24 color="var(--token-color-foreground-success-on-surface)" />
		<span>{text}</span>
	</div>
)

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
					? questions.map((question: FeedbackQuestion) => (
							<Question key={question.id} {...question} />
					  ))
					: null}
				{status === FeedbackFormStatus.finished ? (
					<Finished text={finishedText} />
				) : null}
			</form>
		</FeedbackFormContext.Provider>
	)
}
