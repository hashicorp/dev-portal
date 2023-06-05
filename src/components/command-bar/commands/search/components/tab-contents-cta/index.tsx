/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactElement } from 'react'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import Card from 'components/card'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import s from './tab-contents-cta.module.css'

interface TabContentsCtaProps {
	href: string
	icon: ReactElement<React.JSX.IntrinsicElements['svg']>
	text: string
}

const TabContentsCta = ({ href, icon, text }: TabContentsCtaProps) => {
	return (
		<Card className={s.cta} elevation="base">
			<div className={s.ctaIcon}>{icon}</div>
			<Text asElement="span" className={s.ctaText} size={200} weight="medium">
				{text}
			</Text>
			<StandaloneLink
				href={href}
				icon={<IconArrowRight16 />}
				iconPosition="trailing"
				size="small"
				text="Explore"
			/>
		</Card>
	)
}

export default TabContentsCta
