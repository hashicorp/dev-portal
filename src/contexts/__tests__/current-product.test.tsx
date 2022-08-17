import { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { Product } from 'types/products'
import {
	CurrentProductProvider,
	useCurrentProduct,
} from 'contexts/current-product'

/**
 * Handles rendering both `CurrentProductProvider` and `useCurrentProduct` using
 * the `renderHook` utility from `@testing-library/react-hooks`. Returns the
 * result of `renderHook`.
 */
const setup = (currentProduct: Product) => {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<CurrentProductProvider
			currentProduct={{
				...currentProduct,
				algoliaConfig: {
					indexName: '',
				},
				basePaths: [],
				rootDocsPaths: [],
			}}
		>
			{children}
		</CurrentProductProvider>
	)
	return renderHook(() => useCurrentProduct(), { wrapper })
}

describe('CurrentProductContext', () => {
	let useRouter: jest.SpyInstance
	beforeAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		useRouter = jest.spyOn(require('next/router'), 'useRouter')
		useRouter.mockReturnValue({
			events: {
				off: jest.fn(),
				on: jest.fn(),
			},
		})
	})

	afterAll(() => {
		useRouter.mockRestore()
	})

	test('useCurrentProduct throws an error if not used within CurrentProductProvider', () => {
		const { result } = renderHook(() => useCurrentProduct())

		expect(result.error.message).toBe(
			'useCurrentProduct must be used within a CurrentProductProvider'
		)
	})

	test('CurrentProductProvider renders its children without changes', () => {
		const testText = 'super special unique text for testing'
		render(
			<CurrentProductProvider currentProduct={undefined}>
				{testText}
			</CurrentProductProvider>
		)

		expect(screen.getByText(testText)).toBeDefined()
	})

	describe('useCurrentProduct returns the value provided to CurrentProductProvider', () => {
		test('when the path is "/", null is returned', () => {
			useRouter.mockReturnValueOnce({
				asPath: '/',
				events: {
					off: jest.fn(),
					on: jest.fn(),
				},
			})
			const { result } = setup({ slug: 'waypoint', name: 'Waypoint' })

			expect(result.current).toBeNull()
		})

		test('when the path is not "/", the correct value is returned', () => {
			const { result } = setup({ slug: 'waypoint', name: 'Waypoint' })

			expect(result.current.slug).toEqual('waypoint')
			expect(result.current.name).toEqual('Waypoint')
		})
	})
})
