/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './skip-to-main-content.module.css'

const SidebarSkipToMainContent = () => {
	return (
		<a className={s.root} href="#main">
			Skip to main content
		</a>
	)
}

export default SidebarSkipToMainContent
