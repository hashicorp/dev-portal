/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	CardTitleProps,
	CardDescriptionProps,
} from 'components/card/components'
import { AutosizedHeadingBlockProps } from '..'

interface CardGridBlockCard {
	description: CardDescriptionProps['text']
	title: CardTitleProps['text']
	url: string
}

interface CardGridBlockProps {
	cards: CardGridBlockCard[]
	description: string
	title: AutosizedHeadingBlockProps['text']
	headingId: AutosizedHeadingBlockProps['id']
	headingLevel: AutosizedHeadingBlockProps['level']
}

export type { CardGridBlockCard, CardGridBlockProps }
