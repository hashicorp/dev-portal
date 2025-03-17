/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './page-title.module.css'

const PageTitle = () => {
	return (
		<h1 className={s.root}>
			<span className={s.line1}>Step inside.</span>
			<span className={s.line2}>Define your path.Deploytest</span>
		</h1>
	)
}

export { PageTitle }
