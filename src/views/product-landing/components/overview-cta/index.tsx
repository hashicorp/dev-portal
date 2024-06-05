/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import isAbsoluteUrl from 'lib/is-absolute-url'
import StandaloneLink from 'components/standalone-link'

import { OverviewCtaProps } from './types'
import s from './overview-cta.module.css'
import ThemedImage from 'views/product-landing/components/themed-image'
import classNames from 'classnames'

function OverviewCta({
	heading,
	headingSlug,
	body,
	cta,
	image,
}: OverviewCtaProps) {
	const hasImage = Boolean(image)
	return (
		<div className={s.root}>
			<div className={classNames(s.textPart, { [s.hasImage]: hasImage })}>
				<h2 id={headingSlug} className={s.heading}>
					{heading}
				</h2>
				<p className={s.body}>{body}</p>
				{cta ? (
					<StandaloneLink
						className={s.cta}
						text={cta.text}
						href={cta.url}
						color="secondary"
						icon={
							isAbsoluteUrl(cta.url) ? (
								<IconExternalLink16 />
							) : (
								<IconArrowRight16 />
							)
						}
						iconPosition="trailing"
					/>
				) : null}
			</div>
			{hasImage ? (
				<div className={s.imagePart}>
					<ThemedImage src={image} alt="" />
				</div>
			) : null}
		</div>
	)
}

export { OverviewCta }
export default OverviewCta
