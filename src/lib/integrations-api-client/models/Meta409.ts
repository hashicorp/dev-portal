/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta409 = {
	status_code: Meta409.status_code
	status_text: Meta409.status_text
}

export namespace Meta409 {
	export enum status_code {
		'_409' = 409,
	}

	export enum status_text {
		CONFLICT = 'Conflict',
	}
}
