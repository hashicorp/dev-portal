import { removeLocaleFromPathname } from '.'

describe('removeLocaleFromPathname', () => {
	// Test cases where the locale exists at the beginning of the pathname
	it('should remove the "en" locale and return the remaining pathname', () => {
		const result = removeLocaleFromPathname('/en/anything/else')
		expect(result).toBe('/anything/else')
	})

	it('should remove the "fr" locale and return the remaining pathname', () => {
		const result = removeLocaleFromPathname('/fr/test')
		expect(result).toBe('/test')
	})

	it('should remove the "de" locale and return the remaining pathname', () => {
		const result = removeLocaleFromPathname('/de/another/test')
		expect(result).toBe('/another/test')
	})

	it('should return "/" when the locale is the only segment', () => {
		const result = removeLocaleFromPathname('/pt')
		expect(result).toBe('/')
	})

	it('should return the same pathname if there is no locale', () => {
		const result = removeLocaleFromPathname('/xyz/anything')
		expect(result).toBe('/xyz/anything')
	})

	it('should return the same pathname if the locale is in the middle', () => {
		const result = removeLocaleFromPathname('/path/en/more/segments')
		expect(result).toBe('/path/en/more/segments')
	})

	it('should return the same pathname if there is no match with supported locales', () => {
		const result = removeLocaleFromPathname('/it/something')
		expect(result).toBe('/it/something')
	})

	it('should return an empty string if the pathname is empty', () => {
		const result = removeLocaleFromPathname('')
		expect(result).toBe('')
	})
})
