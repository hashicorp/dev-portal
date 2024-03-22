/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode, Component } from 'react'
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { Product } from 'types/products'
import {
	CurrentProductProvider,
	useCurrentProduct,
} from 'contexts/current-product'
import type { MockInstance } from 'vitest'

/**
 * Handles rendering both `CurrentProductProvider` and `useCurrentProduct` using
 * the `renderHook` utility from `@testing-library/react`. Returns the
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
				integrationsConfig: {},
			}}
		>
			{children}
		</CurrentProductProvider>
	)
	return renderHook(() => useCurrentProduct(), { wrapper })
}

describe('CurrentProductContext', () => {
	let useRouter: MockInstance
	beforeAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		useRouter = vi.spyOn(require('next/router'), 'useRouter')
		useRouter.mockReturnValue({
			events: {
				off: vi.fn(),
				on: vi.fn(),
			},
		})
	})

	afterAll(() => {
		useRouter.mockRestore()
	})

	test('useCurrentProduct throws an error if not used within CurrentProductProvider', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => void 0)

		let error
		renderHook(() => useCurrentProduct(), {
			wrapper: class Wrapper extends Component<{ children: ReactNode }> {
				state = { error: false }

				static getDerivedStateFromError() {
					return { error: true }
				}
				override componentDidCatch(err) {
					error = err
				}
				override render() {
					if (this.state.error) {
						return null
					}
					return this.props.children
				}
			},
		})
		expect(error.message).toEqual(
			'useCurrentProduct must be used within a CurrentProductProvider'
		)

		spy.mockRestore()
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
					off: vi.fn(),
					on: vi.fn(),
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
