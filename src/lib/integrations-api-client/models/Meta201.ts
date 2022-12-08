/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta201 = {
	status_code: Meta201.status_code
	status_text: Meta201.status_text
}

export namespace Meta201 {
	export enum status_code {
		'_201' = 201,
	}

	export enum status_text {
		CREATED = 'Created',
	}
}
