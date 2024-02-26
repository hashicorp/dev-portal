/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useContext } from 'react'
import { SkipLinkContext } from 'contexts'
import s from './skip-to-main-content.module.css'

const SkipToMainContent = () => {
	const { showSkipLink } = useContext(SkipLinkContext)
	return showSkipLink ? (
		<a className={s.root} href="#main">
			Skip to main content
		</a>
	) : null
}

export default SkipToMainContent
