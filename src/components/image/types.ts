/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface ImageProps {
	/**
	 * Source attribute for the image tag.
	 */
	src: JSX.IntrinsicElements['img']['src']

	/**
	 * Alternate text for the image tag. Should be a text equivalent to the
	 * information conveyed in the image. As an example, the alternate text
	 * "Diagram of Humans or Machines Clients" is likely not sufficient because
	 * it does not express all of the same information as the diagram does
	 * for sighted users. It's important to provide the same information
	 * experience for all users regardless of ability.
	 */
	alt: JSX.IntrinsicElements['img']['src']

	/**
	 * Title attribute for the image. Typically only used if the image
	 * is nested in an <a /> tag and needs to serve as text for the link.
	 */
	title?: JSX.IntrinsicElements['img']['title']

	/**
	 * Avoids adding margin to the component.
	 * For use in other elements, such as ImageConfig
	 */
	noMargin?: boolean

	/**
	 * Avoids adding border to the component.
	 * For use in other elements, such as ImageConfig
	 */
	noBorder?: boolean

	/**
	 * An explicit width value to be passed to the img element
	 */
	width?: number

	/**
	 * An explicit height value to be passed to the img element
	 */
	height?: number

	/**
	 * Indicates whether or not the image element should render as an inline element,
	 * as opposed to a block element. Defaults to: false.
	 */
	inline?: boolean
}
