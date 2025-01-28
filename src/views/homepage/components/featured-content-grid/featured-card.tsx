/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import CardLink from 'components/card-link'
import { StandaloneLinkContents } from 'components/standalone-link'
import s from './featured-card.module.css'

const FeaturedCard = ({
	children,
	className,
	href,
	title,
}: {
	children: React.ReactNode
	className: string
	href: string
	title: string
}) => {
	return (
		<CardLink
			ariaLabel={title}
			className={classNames(s.card, className)}
			href={href}
		>
			<div>{children}</div>
			<div className={s.learnMoreCtaContainer}>
				<StandaloneLinkContents
					className={s.learnMoreCta}
					icon={<IconArrowRight16 />}
					iconPosition="trailing"
					size="medium"
					text="Learn more"
				/>
			</div>
		</CardLink>
	)
}

export default FeaturedCard
