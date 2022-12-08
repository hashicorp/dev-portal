/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta404 = {
	status_code: Meta404.status_code
	status_text: Meta404.status_text
}

export namespace Meta404 {
	export enum status_code {
		'_404' = 404,
	}

	export enum status_text {
		NOT_FOUND = 'Not Found',
	}
}
