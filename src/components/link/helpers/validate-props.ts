import { LinkProps } from 'components/link'
import { developmentToast, ToastColor } from 'components/toast'

/**
 * Validates some of the props passed into the component.
 */
const validateProps = ({
	opensInNewTab,
	target,
}: Pick<LinkProps, 'opensInNewTab' | 'target'>) => {
	/**
	 * Check if `target="_blank"` is used rather than `opensInNewTab`.
	 *
	 * @NOTE While the component successfully handles when `target="_blank"`,
	 * using the `opensInNewTab` prop can lower the cognitive load of reading and
	 * writing a reference to this component that opens a link in a new tab.
	 *
	 * This code requires 1) the reader to know what target="_blank" does and 2)
	 * the writer to recall the exact property name and value:
	 *
	 *    <Link {...otherProps} target="_blank" />
	 *
	 * This code does not require 1) the reader to know what target="_blank" does
	 * and 2) the writer to recall the exact property name and value (just a the
	 * name of the property that has a more intuitive name than `target`):
	 *
	 *    <Link {...otherProps} opensInNewTab />
	 *
	 */
	if (opensInNewTab !== true && target === '_blank') {
		developmentToast({
			color: ToastColor.warning,
			title: 'Warning in src/components/Link',
			description:
				'`target="_blank"` was used instead of the `opensInNewTab` prop.',
		})
	}

	/**
	 * Generate the `target` prop.
	 *
	 * @NOTE The `opensInNewTab` prop takes precedence over the `target` prop.
	 * This is because the `opensInNewTab` prop renders a screen-reader-only label
	 * when `true`. If both `opensInNewTab` and `target` were passed, and `target`
	 * did not have the value of `"_blank"`, then the screen-reader-only label
	 * would not be accurate.
	 */
	if (opensInNewTab && !!target) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in src/components/Link',
			description:
				'Both `opensInNewTab` and `target` were passed. Only pass one or the other.',
		})
	}
}

export { validateProps }
