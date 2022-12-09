// Third-party imports
import { forwardRef, Fragment } from 'react'
import classNames from 'classnames'

// Global imports
import { useDisclosureState } from 'components/disclosure'
import disclosureStyles from 'components/disclosure/disclosure.module.css'

// Local imports
import {
	DisclosureActivatorForwardedRef,
	DisclosureActivatorProps,
} from './types'
import { getHeadingWrapper } from './components/heading-wrapper'

/**
 * Component for rendering the always-visible activator within a `Disclosure`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/disclosure
 */
// eslint-disable-next-line react/display-name
const DisclosureActivator = forwardRef(
	(
		{
			ariaLabel,
			children,
			className,
			'data-heap-track': dataHeapTrack,
			headingLevel,
		}: DisclosureActivatorProps,
		ref: DisclosureActivatorForwardedRef
	) => {
		const { contentContainerId, isOpen, toggleDisclosure } =
			useDisclosureState()

		/**
		 * If headingLevel is provided,
		 * wrap the button in a corresponding heading element.
		 */
		const Wrapper =
			typeof headingLevel !== 'undefined'
				? getHeadingWrapper(headingLevel)
				: Fragment

		return (
			<Wrapper>
				<button
					aria-controls={contentContainerId}
					aria-expanded={isOpen}
					aria-label={ariaLabel}
					className={classNames(disclosureStyles.activator, className)}
					onClick={toggleDisclosure}
					ref={ref}
					data-heap-track={dataHeapTrack}
				>
					{children}
				</button>
			</Wrapper>
		)
	}
)

export type { DisclosureActivatorForwardedRef, DisclosureActivatorProps }
export default DisclosureActivator
