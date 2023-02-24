/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
