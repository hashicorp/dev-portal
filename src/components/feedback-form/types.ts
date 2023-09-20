/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode, MouseEvent, type ReactElement } from 'react'

interface FeedbackQuestionBase {
	id: string
	labelIcon?: ReactElement<React.JSX.IntrinsicElements['svg']>
	label: string
	labelSecondary?: string
}

export interface FeedbackQuestionChoiceAnswer {
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
	display: string
	value: string
	nextQuestion?: string
}

interface FeedbackQuestionChoice extends FeedbackQuestionBase {
	type: 'choice'
	answers: FeedbackQuestionChoiceAnswer[]
}

interface FeedbackQuestionText extends FeedbackQuestionBase {
	type: 'text'
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
	buttonText: string
	nextQuestion?: string
	placeholder?: string
	optional?: boolean
}

export type FeedbackQuestion = FeedbackQuestionText | FeedbackQuestionChoice

export interface FeedbackResponse {
	id: string
	value: string
}

export interface FeedbackFormProps {
	/**
	 * The list of questions which are displayed to the user.
	 */
	questions: FeedbackQuestion[]
	/**
	 * Called each time a question is submitted
	 */
	onQuestionSubmit:
		| (() => void)
		| ((responses: FeedbackResponse[], sessionId: string) => Promise<void>)
	/**
	 * Text to display when form is submitted
	 */
	finishedText: ReactNode
}

export type FeedbackFormContext =
	| {
			isTransitioning: boolean
			activeQuestion: string | undefined
			submitQuestion(
				e: MouseEvent<HTMLElement>,
				answer: FeedbackResponse & { nextQuestion?: string }
			): void
	  }
	| Record<string, never>

export enum FeedbackFormStatus {
	inProgress,
	finished,
}
