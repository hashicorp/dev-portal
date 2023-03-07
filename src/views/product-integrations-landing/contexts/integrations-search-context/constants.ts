import { decodeDelimitedArray, encodeDelimitedArray } from 'use-query-params'

/**
 * Uses a comma to delimit entries. e.g. ['a', 'b'] => qp?=a,b
 * https://github.com/pbeshai/use-query-params/blob/master/packages/use-query-params/README.md?plain=1#L374-L380
 */
const CommaArrayParam = {
	encode: (array: string[] | null | undefined) =>
		encodeDelimitedArray(array, ','),

	decode: (arrayStr: string | string[] | null | undefined) =>
		decodeDelimitedArray(arrayStr, ','),
}

export { CommaArrayParam }
