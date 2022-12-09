import React, { useState } from 'react'
import classNames from 'classnames'
import MarketoForm from '@hashicorp/react-marketo-form'
import type { MarketoForm as MarketoFormProps } from '@hashicorp/react-marketo-form/types'

import { safeAnalyticsTrack } from 'lib/analytics'
import Text from 'components/text'
import SubmitMessage from './submit-message'
import s from './marketo-form-data.module.css'

export interface NewsletterSignupFormProps {
	marketoFormData: MarketoFormData
	buttonText?: string
	appearance?: 'light' | 'dark'
}

export interface MarketoFormData {
	id: number
	form: MarketoFormProps
}

function NewsletterSignupForm({
	buttonText = 'Submit',
	appearance = 'light',
	marketoFormData,
}: NewsletterSignupFormProps) {
	// TODO: how do we pass leadsource back to Marketo?
	// leadSource: querystring.source === 'linkedin' ? 'LinkedIn Paid' : 'Website',
	const [submissionStatus, setSubmissionStatus] = useState(null)

	const onSubmitSuccess = () => {
		setSubmissionStatus('success')
		safeAnalyticsTrack('Newsletter Signup', {
			placement: 'Dev dot certifications',
		})
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
				<>
					<Text weight="semibold" size={200}>
						Business email address
					</Text>
					<MarketoForm
						formId={marketoFormData.id}
						marketoForm={marketoFormData.form}
						submitTitle={buttonText}
						className={classNames(s.form, s.dark)}
						onSubmitSuccess={onSubmitSuccess}
						onSubmitError={onSubmitError}
					/>
				</>
			)}
		</div>
	)
}

export { NewsletterSignupForm }
