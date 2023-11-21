/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactNode } from 'react'

// Global imports
import Card from 'components/card'
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
		<Card className={classNames(s.root, className)} elevation="base">
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
		</Card>
	)
}

export default CardWithLink
