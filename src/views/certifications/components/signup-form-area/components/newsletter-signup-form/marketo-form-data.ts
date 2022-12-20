import type { MarketoForm as MarketoFormProps } from '@hashicorp/react-marketo-form/types'

export const marketoFormData: { id: number; form: MarketoFormProps } = {
	id: 2459,
	form: {
		result: [
			{
				id: 'Email',
				dataType: 'email',
				validationMessage: 'Must be a valid email address.',
				rowNumber: 0,
				columnNumber: 0,
				required: true,
				label: 'Business email address',
				formPrefill: true,
				visibilityRules: { ruleType: 'alwaysShow' },
				hintText: 'Business email address',
			},
			{
				id: 'Consent_Privacy_Policy__c',
				dataType: 'checkbox',
				validationMessage: 'This field is required.',
				rowNumber: 1,
				columnNumber: 0,
				required: true,
				formPrefill: true,
				fieldMetaData: { initiallyChecked: false },
				visibilityRules: { ruleType: 'alwaysShow' },
			},
			{
				id: 'utm_medium__c',
				label: 'utm_medium:',
				dataType: 'hidden',
				rowNumber: 2,
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
				rowNumber: 3,
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
				rowNumber: 4,
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
				rowNumber: 5,
				columnNumber: 0,
				required: false,
				autoFill: { value: '', valueFrom: 'query', parameterName: 'utm_cid' },
			},
			{
				id: 'utm_offer__c',
				label: 'utm_offer:',
				dataType: 'hidden',
				rowNumber: 6,
				columnNumber: 0,
				required: false,
				autoFill: { value: '', valueFrom: 'query', parameterName: 'utm_offer' },
			},
			{
				id: 'form_page_url__c',
				label: 'form_page_url:',
				dataType: 'hidden',
				rowNumber: 7,
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
				rowNumber: 8,
				columnNumber: 0,
				required: false,
				autoFill: { value: '', valueFrom: 'query', parameterName: 'utm_term' },
			},
			{
				id: 'utm_content__c',
				label: 'utm_content:',
				dataType: 'hidden',
				rowNumber: 9,
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
				rowNumber: 10,
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
				rowNumber: 11,
				columnNumber: 0,
				required: false,
				autoFill: { value: 'TRUE', valueFrom: 'default', parameterName: '' },
			},
		],
		/**
		 * TODO:
		 * Look into why types here aren't matching up as expected.
		 * This data and the newsletter-signup-form component generally were
		 * pulled from hashicorp-www-next, so this seems like it's functioning
		 * in production, so may be more an issue with incomplete types?
		 */
	} as unknown as MarketoFormProps,
}
