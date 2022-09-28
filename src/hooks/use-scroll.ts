import { RefObject, useState } from 'react'
import { AxisScrollInfo, scroll, ScrollOptions } from '@motionone/dom'
import useSafeLayoutEffect from './use-safe-layout-effect'

interface UseScrollOptions extends Omit<ScrollOptions, 'container' | 'target'> {
	container?: RefObject<HTMLElement>
	target?: RefObject<HTMLElement>
}

interface ScrollValues {
	scrollX: number
	scrollXProgress: number
	scrollY: number
	scrollYProgress: number
}

/**
 * Track scroll metrics.
 * Uses `@motionone/dom` under the hood.
 *
 * https://motion.dev/dom/scroll
 */
export default function useScroll({
	container,
	target,
	...options
}: UseScrollOptions = {}) {
	const [scrollValues, setScrollValues] = useState<ScrollValues>({
		scrollX: 0,
		scrollXProgress: 0,
		scrollY: 0,
		scrollYProgress: 0,
	})

	useSafeLayoutEffect(() => {
		return scroll(
			({ x, y }: { x: AxisScrollInfo; y: AxisScrollInfo }) => {
				setScrollValues({
					scrollX: x.current,
					scrollXProgress: x.progress,
					scrollY: y.current,
					scrollYProgress: y.progress,
				})
			},
			{
				...options,
				container: container?.current || undefined,
				target: target?.current || undefined,
			}
		)
	}, [])

	return scrollValues
}
