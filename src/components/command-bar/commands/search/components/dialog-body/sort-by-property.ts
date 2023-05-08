/**
 * Sorts an array of objects on the property accessed by the given `key`.
 * @param {Array} arr
 * @param {string} key
 * @param {'asc'|'desc'} dir
 * @returns {Array}
 */
export default function sortByProperty(arr, key, dir) {
	return arr.slice().sort((a, b) => {
		const aBeforeB = dir === 'desc' ? a[key] > b[key] : a[key] < b[key]
		const bBeforeA = dir === 'desc' ? b[key] > a[key] : b[key] < a[key]
		return aBeforeB ? -1 : bBeforeA ? 1 : 0
	})
}
