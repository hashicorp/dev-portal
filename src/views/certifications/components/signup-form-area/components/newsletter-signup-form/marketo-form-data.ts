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
				createdAt: '2023-05-23T16:15:32Z+0000',
				updatedAt: '2023-05-23T16:15:32Z+0000',
				url: 'https://app-ab32.marketo.com/#FO2459B2',
				status: 'draft',
				theme: 'simple',
				language: 'English',
				locale: null,
				progressiveProfiling: false,
				labelPosition: 'left',
				fontFamily: 'Helvetica',
				fontSize: '13px',
				folder: {
					type: 'Folder',
					value: 35855,
					folderName: 'f. Dotcom',
				},
				knownVisitor: {
					type: 'form',
					template: null,
				},
				thankYouList: [
					{
						followupType: 'url',
						followupValue: 'https://www.hashicorp.com/thank-you/contact-sales',
						default: true,
					},
				],
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
				validationMessage: 'Please enter a valid business email address.',
				rowNumber: 0,
				columnNumber: 0,
				required: true,
				formPrefill: true,
				visibilityRules: {
					ruleType: 'alwaysShow',
				},
				hintText: 'Business Email Address',
			},
			{
				id: 'Consent_Privacy_Policy__c',
				label: 'Send me news about HashiCorp products, releases and events.',
				dataType: 'checkbox',
				validationMessage: 'This field is required.',
				rowNumber: 1,
				columnNumber: 0,
				required: false,
				formPrefill: true,
				fieldMetaData: {
					initiallyChecked: false,
				},
				visibilityRules: {
					ruleType: 'alwaysShow',
				},
			},
			{
				id: 'privacy-policy-text',
				labelWidth: 260,
				dataType: 'htmltext',
				rowNumber: 2,
				columnNumber: 0,
				visibilityRules: {
					ruleType: 'alwaysShow',
				},
				text: 'By submitting this form, you acknowledge and agree that HashiCorp will process your personal information in accordance with the <a target="_blank" href="https://www.hashicorp.com/privacy">Privacy Policy</a>.',
			},
			{
				id: 'utm_medium__c',
				label: 'utm_medium:',
				dataType: 'hidden',
				rowNumber: 3,
				columnNumber: 0,
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
				rowNumber: 4,
				columnNumber: 0,
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
				rowNumber: 5,
				columnNumber: 0,
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
				rowNumber: 6,
				columnNumber: 0,
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_cid',
				},
			},
			{
				id: 'utm_offer__c',
				label: 'utm_offer:',
				dataType: 'hidden',
				rowNumber: 7,
				columnNumber: 0,
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_offer',
				},
			},
			{
				id: 'form_page_url__c',
				label: 'form_page_url:',
				dataType: 'hidden',
				rowNumber: 8,
				columnNumber: 0,
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
				rowNumber: 9,
				columnNumber: 0,
				required: false,
				autoFill: {
					value: '',
					valueFrom: 'query',
					parameterName: 'utm_term',
				},
			},
			{
				id: 'utm_content__c',
				label: 'utm_content:',
				dataType: 'hidden',
				rowNumber: 10,
				columnNumber: 0,
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
				rowNumber: 11,
				columnNumber: 0,
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
				rowNumber: 12,
				columnNumber: 0,
				required: false,
				autoFill: {
					value: 'TRUE',
					valueFrom: 'default',
					parameterName: '',
				},
			},
		],
	},
}
