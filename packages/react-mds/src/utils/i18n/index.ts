import { createLocalize } from '@web/utils/i18n'

export const localize = createLocalize({
	de: {
		optional: 'optional', // "optional" is the same in German
		required: 'erforderlich',
	},
	en: {
		optional: 'optional',
		required: 'required',
	},
	es: {
		optional: 'opcional',
		required: 'obligatorio',
	},
	fr: {
		optional: 'facultatif',
		required: 'obligatoire',
	},
	id: {
		// ! TODO Translate text to Indonesian
		optional: 'optional',
		required: 'required',
	},
	ja: {
		optional: '任意',
		required: '必須',
	},
	ko: {
		optional: '선택 사항',
		required: '필수',
	},
	pt: {
		optional: 'opcional',
		required: 'obrigatório',
	},
})
