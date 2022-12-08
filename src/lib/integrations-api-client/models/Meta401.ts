/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta401 = {
	status_code: Meta401.status_code
	status_text: Meta401.status_text
}

export namespace Meta401 {
	export enum status_code {
		'_401' = 401,
	}

	export enum status_text {
		UNAUTHORIZED = 'Unauthorized',
	}
}
