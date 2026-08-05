/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Heading from '@components/heading'
import Text from '@components/text'
import Link from '@components/link'
import Image from 'next/image'

// Styles
import s from './link-with-image.module.css'

// Icon
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

export const LinkWithImage = ({
	title,
	description,
	cta,
	ctaLink,
	image,
}: {
	title: string
	description: string
	cta: string
	ctaLink: string
	image: string
}) => {
	return (
		<div className={s.linkWithImage}>
			<div className={s.content}>
				<div className={s.textContent}>
					<Heading className={s.title}level={2} size={500} weight="bold">
						{title}
					</Heading>
					<Text className={s.description}>{description}</Text>
				</div>
				<Link className={s.cta} href={ctaLink}>
					{cta}
					<IconChevronRight16 />
				</Link>
			</div>
			<div className={s.image}>
				<Image src={image} alt={title} fill={true} />
			</div>
		</div>
	)
}
