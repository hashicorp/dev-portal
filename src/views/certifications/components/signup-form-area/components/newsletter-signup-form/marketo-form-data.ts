/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { MarketoFormAPIResponse } from '@hashicorp/react-marketo-form/types'

export const marketoFormData: MarketoFormAPIResponse = {
	metadata: {
		success: true,
		errors: [],
		result: [
			{
				id: 2459,
				name: 'FORM - Newsletter Sign Up',
				description: '',
				createdAt: '2022-10-26T23:38:43Z+0000',
				updatedAt: '2023-01-03T20:57:20Z+0000',
				url: 'https://app-ab32.marketo.com/#FO2459B2',
				status: 'approved',
				theme: 'simple',
				language: 'English',
				locale: null,
				progressiveProfiling: false,
				labelPosition: 'left',
				fontFamily: 'Helvetica',
				fontSize: '13px',
				buttonLocation: 120,
				buttonLabel: 'Submit',
				waitingLabel: 'Please Wait',
				workSpaceId: 1,
			},
		],
	},
	fields: {
		success: true,
		errors: [],
		result: [
			{
				id: 'Email',
				dataType: 'email',
				validationMessage: 'Must be a valid email address.',
				required: true,
				visibilityRules: { ruleType: 'alwaysShow' },
				hintText: 'Business Email Address',
			},
			{
				id: 'Consent_Privacy_Policy__c',
				dataType: 'checkbox',
				validationMessage: 'This field is required.',
				required: true,
				fieldMetaData: { initiallyChecked: false },
				visibilityRules: { ruleType: 'alwaysShow' },
			},
			{
				id: 'utm_medium__c',
				label: 'utm_medium:',
				dataType: 'hidden',
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_medium',
				},
			},
			{
				id: 'utm_source__c',
				label: 'utm_source:',
				dataType: 'hidden',
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_source',
				},
			},
			{
				id: 'utm_campaign__c',
				label: 'utm_campaign:',
				dataType: 'hidden',
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_campaign',
				},
			},
			{
				id: 'utm_cid__c',
				label: 'utm_cid:',
				dataType: 'hidden',
				required: false,
				autoFill: { value: '', valueFrom: 'query', parameterName: 'utm_cid' },
			},
			{
				id: 'utm_offer__c',
				label: 'utm_offer:',
				dataType: 'hidden',
				required: false,
				autoFill: { value: '', valueFrom: 'query', parameterName: 'utm_offer' },
			},
			{
				id: 'form_page_url__c',
				label: 'form_page_url:',
				dataType: 'hidden',
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'form_page_url',
				},
			},
			{
				id: 'utm_term__c',
				label: 'utm_term:',
				dataType: 'hidden',
				required: false,
				autoFill: { value: '', valueFrom: 'query', parameterName: 'utm_term' },
			},
			{
				id: 'utm_content__c',
				label: 'utm_content:',
				dataType: 'hidden',
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_content',
				},
			},
			{
				id: 'utm_channel_bucket__c',
				label: 'utm_channel_bucket:',
				dataType: 'hidden',
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_channel_bucket',
				},
			},
			{
				id: 'Signed_Up_For_Newsletter__c',
				label: 'Signed Up For Newsletter:',
				dataType: 'hidden',
				required: false,
				autoFill: { value: 'TRUE', valueFrom: 'default', parameterName: '' },
			},
		],
	},
}
