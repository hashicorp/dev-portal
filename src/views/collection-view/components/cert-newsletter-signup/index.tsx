/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SignupFormArea } from 'views/certifications/components'
import s from './cert-newsletter-signup.module.css'

function CertNewsletterSignup() {
	return (
		<div className={s.root}>
			<SignupFormArea />
		</div>
	)
}

export default CertNewsletterSignup
