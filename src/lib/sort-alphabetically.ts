export function sortAlphabetically<A, B>(property: string) {
	return (a: A, b: B) => {
		const A = a[property].toUpperCase()
		const B = b[property].toUpperCase()

		if (A < B) {
			return -1
		}
		if (A > B) {
			return 1
		}
		return 0
	}
}
