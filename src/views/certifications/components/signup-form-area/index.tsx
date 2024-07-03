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
import { HTMLAttributes } from 'react'
import classNames from 'classnames'

const APPEARANCE_SLUG = 'dark'

export function SignupFormArea({
	className = '',
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={classNames(s.root, className)}>
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
