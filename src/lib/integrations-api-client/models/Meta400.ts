/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta400 = {
	status_code: Meta400.status_code
	status_text: Meta400.status_text
}

export namespace Meta400 {
	export enum status_code {
		'_400' = 400,
	}

	export enum status_text {
		BAD_REQUEST = 'Bad Request',
	}
}
