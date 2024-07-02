/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ErrorBoundary } from 'react-error-boundary'
import { marketoFormData } from './components/newsletter-signup-form/marketo-form-data'
import SignupHeader from './components/signup-header'
import {
	NewsletterSignupForm,
	SubmitMessage,
} from './components/newsletter-signup-form'
import s from './signup-form-area.module.css'

const APPEARANCE_SLUG = 'dark'

interface SignupFormAreaProps {
	className?: string
}

export function SignupFormArea({ className = '' }: SignupFormAreaProps) {
	return (
		<div className={`${s.root} ${className}`}>
			<div className={s.form}>
				<SignupHeader />
				<ErrorBoundary
					FallbackComponent={() => (
						<SubmitMessage submitStatus="error" appearance={APPEARANCE_SLUG} />
					)}
				>
					<NewsletterSignupForm
						marketoFormData={marketoFormData}
						appearance={APPEARANCE_SLUG}
					/>
				</ErrorBoundary>
			</div>
		</div>
	)
}
