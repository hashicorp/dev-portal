import React, {
	useContext,
	createContext,
	useMemo,
	useState,
	useRef,
	MouseEvent,
} from 'react'
import classNames from 'classnames'
import shortid from 'shortid'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import Button from 'components/button'
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

interface QuestionProps {
	question: FeedbackQuestion
	animate?: boolean
}

const Question: React.FC<QuestionProps> = ({
	question,
	animate,
}: QuestionProps) => {
	const { id, type, label, labelSecondary, labelIcon } = question
	const [inputValue, setInputValue] = useState('')
	const feedbackContext = useContext(FeedbackFormContext)

	if (feedbackContext.activeQuestion !== id) {
		return null
	}

	let inputs: React.ReactNode

	switch (type) {
		case 'choice': {
			const { answers } = question
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
			const { optional, buttonText, nextQuestion } = question
			const isButtonDisabled =
				!optional && (inputValue === '' || feedbackContext.isTransitioning)
			const inputHasEntry = inputValue.length

			inputs = (
				<>
					<div className={s.textAreaContainer}>
						<textarea
							id={id}
							value={inputValue}
							onChange={(e) => setInputValue(e.currentTarget.value)}
							className={classNames(
								s.textArea,
								inputHasEntry ? s.visited : null
							)}
							placeholder="Your feedback..."
						/>
						{optional && !inputHasEntry ? (
							<span className={s.optionalText}>(optional)</span>
						) : null}
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
		<div className={classNames(s.question, s[type], animate && s.animate)}>
			<label htmlFor={id} className={s.labelWrapper}>
				{labelIcon && <div className={s.labelIcon}>{labelIcon}</div>}
				<div className={s.label}>
					<span>
						<strong>{label}</strong>
						{labelSecondary ? ` ${labelSecondary}` : ''}
					</span>
				</div>
			</label>
			{inputs}
		</div>
	)
}

const Finished: React.FC<{ text: FeedbackFormProps['finishedText'] }> = ({
	text,
}: {
	text: FeedbackFormProps['finishedText']
}) => (
	<div className={s.finished}>
		<IconCheckCircle24 color="var(--token-color-foreground-success-on-surface)" />
		{text}
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
