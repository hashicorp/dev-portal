/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/image'
import s from './themed-image.module.css'

export interface ThemedImageProps {
	src: {
		dark: string
		light: string
	}
	alt: string
}

/**
 * This component can be used in views where we need to
 * conditionally render an image based on the theme state.
 *
 * See styles/themes/global.css for the attribute handler
 * that uses `display:none` to conditionally render content
 * based on the theme state with css
 */
export default function ThemedImage({ src, alt }: ThemedImageProps) {
	return (
		<>
			<span data-hide-on-theme="light" className={s.root}>
				<Image className={s.image} src={src.dark} alt={alt} fill />
			</span>

			<span data-hide-on-theme="dark" className={s.root}>
				<Image className={s.image} src={src.light} alt={alt} fill />
			</span>
		</>
	)
}
