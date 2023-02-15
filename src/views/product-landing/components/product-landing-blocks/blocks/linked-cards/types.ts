/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface LinkedCard {
	heading: string
	body: string
	url: string
}

export interface LinkedCardsProps {
	cards: LinkedCard[]
}
