import React, { useContext, useState, MouseEvent } from 'react'
import classNames from 'classnames'
import Button from 'components/button'
import {
	type FeedbackQuestion,
	type FeedbackQuestionChoiceAnswer,
} from '../../types'
import { FeedbackFormContext } from '../../'
import s from './question.module.css'

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
				<span className={s.label}>
					<strong>{label}</strong>
					{labelSecondary ? ` ${labelSecondary}` : ''}
				</span>
			</label>
			{inputs}
		</div>
	)
}

export { Question }
