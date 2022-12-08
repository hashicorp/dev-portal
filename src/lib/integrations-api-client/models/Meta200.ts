/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta200 = {
	status_code: Meta200.status_code
	status_text: Meta200.status_text
}

export namespace Meta200 {
	export enum status_code {
		'_200' = 200,
	}

	export enum status_text {
		OK = 'OK',
	}
}
