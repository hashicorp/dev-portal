/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/legacy/image'
import classNames from 'classnames'
import { GlobalThemeOption } from 'styles/themes/types'
import { CompanyLogoOption, CompanyLogoProps } from './types'
import s from './company-logo.module.css'

export default function CompanyLogo({ name }: CompanyLogoProps): JSX.Element {
	if (!(name in CompanyLogoOption)) {
		console.log('Company Logo does not exist')
		return <></>
	}

	const src = {
		light:
			name === 'terraform-cloud'
				? require('@hashicorp/mktg-logos/product/terraform-cloud/primary/color.svg?url')
				: require(`./img/${name}.png?url`),
		dark:
			name === 'terraform-cloud'
				? require('@hashicorp/mktg-logos/product/terraform-cloud/primary/colorwhite.svg?url')
				: require(`./img/${name}_dm.png?url`),
	}

	return (
		<span className={s.root}>
			<ThemedLogo theme={GlobalThemeOption.dark} src={src.dark} />
			<ThemedLogo theme={GlobalThemeOption.light} src={src.light} />
		</span>
	)
}

function ThemedLogo({ theme, src }: { theme: GlobalThemeOption; src: string }) {
	return (
		<span
			className={classNames(s.inner, s[`logo-${name}`])}
			data-hide-on-theme={theme}
		>
			<Image
				data-hide-on-theme={theme}
				src={src}
				alt=""
				/**
				 * Note: for use in CollectionCard, consumer should provide meaningful
				 * text using the card heading element.
				 */
				objectPosition="left center"
				layout="fill"
				objectFit="contain"
			/>
		</span>
	)
}
