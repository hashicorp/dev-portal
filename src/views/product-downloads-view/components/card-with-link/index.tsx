/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactNode } from 'react'

// Global imports
import { MDSCard } from '@components/mds-card'
import Text from 'components/text'

// Local imports
import s from './card-with-link.module.css'
import classNames from 'classnames'

interface CardWithLinkProps {
	className?: string
	heading: string
	subheading?: string | ReactNode
	icon?: ReactNode
	link?: ReactNode
}

const CardWithLink = ({
	className,
	heading,
	subheading,
	icon,
	link,
}: CardWithLinkProps) => {
	return (
		<MDSCard className={classNames(s.root, className)} isLightBackground={true}>
			{typeof icon !== 'undefined' ? icon : null}
			<div className={s.contentContainer}>
				<Text className={s.contentHeading} size={200} weight="semibold">
					{heading}
				</Text>
				{typeof subheading !== 'undefined' ? (
					<Text className={s.contentSubheading} size={200} weight="regular">
						{subheading}
					</Text>
				) : null}
			</div>
			{typeof link !== 'undefined' ? link : null}
		</MDSCard>
	)
}

export default CardWithLink
