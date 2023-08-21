import { ReactNode } from 'react'

/**
 * Given an array of strings,
 * Return the array with `<wbr />` elements inserted between each string.
 */
export function addWordBreaks(stringArray: string[]): ReactNode[] {
	return stringArray
		.map((v: string, idx: number) => {
			// eslint-disable-next-line react/no-array-index-key
			return idx === 0 ? [v] : [<wbr key={idx} />, v]
		})
		.flat()
}
