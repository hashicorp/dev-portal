/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { useState } from 'react'
import classNames from 'classnames'
import MarketoForm from '@hashicorp/react-marketo-form'
import type { MarketoFormAPIResponse } from '@hashicorp/react-marketo-form/types'
import { safeAnalyticsTrack } from 'lib/analytics'
import SubmitMessage from './submit-message'
import s from './marketo-form-data.module.css'

export interface NewsletterSignupFormProps {
	marketoFormData: MarketoFormAPIResponse
	buttonText?: string
	// Note: we've hacked around styles, so only 'dark' is supported
	appearance?: 'dark'
}

function NewsletterSignupForm({
	buttonText = 'Submit',
	appearance = 'dark',
	marketoFormData,
}: NewsletterSignupFormProps) {
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
		<div>
			{submissionStatus ? (
				<SubmitMessage
					submitStatus={submissionStatus}
					appearance={appearance}
				/>
			) : (
				<MarketoForm
					{...marketoFormData}
					submitTitle={buttonText}
					className={classNames(s.formStyleOverrides, s.dark)}
					onSubmitSuccess={onSubmitSuccess}
					onSubmitError={onSubmitError}
				/>
			)}
		</div>
	)
}

export { NewsletterSignupForm, SubmitMessage }
