/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import s from './error-view-components.module.css'

/**
 * A content container for use in dev-dot error views,
 * which includes max-width, min-height, and alignment styles.
 */
function ErrorViewContainer({ children }: { children: ReactNode }) {
	return <div className={s.container}>{children}</div>
}

/**
 * A container for <ButtonLink /> ctas in dev-dot error views.
 */
function ErrorViewCtas({ children }: { children: ReactNode }) {
	return <div className={s.ctas}>{children}</div>
}

/**
 * An <h1> element for use in dev-dot error views.
 */
function ErrorViewH1({ children }: { children: ReactNode }) {
	return <h1 className={s.heading}>{children}</h1>
}

/**
 * An <p> element for use in dev-dot error views.
 */
function ErrorViewParagraph({ children }: { children: ReactNode }) {
	return <p className={s.paragraph}>{children}</p>
}

export { ErrorViewContainer, ErrorViewH1, ErrorViewCtas, ErrorViewParagraph }
