import { withTiming } from '../with-timing'

describe('withTiming', () => {
	const env = process.env

	let timeSpy: jest.SpyInstance
	let timeEndSpy: jest.SpyInstance

	beforeEach(() => {
		jest.resetAllMocks()
		timeSpy = jest.spyOn(console, 'time')
		timeEndSpy = jest.spyOn(console, 'timeEnd')

		process.env = { ...env } // Make a copy
	})

	afterEach(() => {
		process.env = env
	})

	it('should return the value of the wrapped function', async () => {
		process.env.HC_DEBUG_TIMINGS = '1'

		const myFunc = async (val: any) => {
			return new Promise((res) => res(val))
		}

		const res = await withTiming('[test]', () => myFunc(100))

		expect(res).toMatchInlineSnapshot(`100`)

		expect(timeSpy).toHaveBeenCalledWith('[test]')
		expect(timeEndSpy).toHaveBeenCalledWith('[test]')
	})

	it('should act as a passthrough if `HC_DEBUG_TIMINGS` is not set', async () => {
		const myFunc = async (val: any) => {
			return new Promise((res) => res(val))
		}

		const res = await withTiming('[test]', () => myFunc(10))

		expect(res).toMatchInlineSnapshot(`10`)

		expect(timeSpy).not.toHaveBeenCalled()
		expect(timeEndSpy).not.toHaveBeenCalled()
	})
})
