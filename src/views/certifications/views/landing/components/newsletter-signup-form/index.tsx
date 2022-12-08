import React, { useState } from 'react'
import classNames from 'classnames'
import MarketoForm from '@hashicorp/react-marketo-form'
import SubmitMessage from './submit-message'
import type { MarketoForm as MarketoFormProps } from '@hashicorp/react-marketo-form/types'
import s from './style.module.css'

export interface NewsletterSignupFormProps {
	marketoFormData: MarketoFormData
	placement?: 'footer'
	buttonText?: string
	appearance?: 'light' | 'dark'
}

export interface MarketoFormData {
	id: number
	form: MarketoFormProps
}

function NewsletterSignupForm({
	placement,
	buttonText = 'Submit',
	appearance = 'light',
	marketoFormData,
}: NewsletterSignupFormProps) {
	// TODO: how do we pass leadsource back to Marketo?
	// leadSource: querystring.source === 'linkedin' ? 'LinkedIn Paid' : 'Website',
	const [submissionStatus, setSubmissionStatus] = useState(null)

	const onSubmitSuccess = () => {
		setSubmissionStatus('success')
		if (window && window.analytics && placement) {
			window.analytics.track('Newsletter Signup', { placement })
		}
	}

	const onSubmitError = () => {
		setSubmissionStatus('error')
	}

	return (
		<div className={s.formWrapper} data-test-id="newsletterSignupForm">
			{submissionStatus ? (
				<SubmitMessage
					submitStatus={submissionStatus}
					appearance={appearance}
				/>
			) : (
				<MarketoForm
					formId={marketoFormData.id}
					marketoForm={marketoFormData.form}
					submitTitle={buttonText}
					className={classNames([s.form, s[placement]])}
					onSubmitSuccess={onSubmitSuccess}
					onSubmitError={onSubmitError}
				/>
			)}
		</div>
	)
}

export { NewsletterSignupForm }
