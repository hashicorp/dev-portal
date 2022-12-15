import { marketoFormData } from './components/newsletter-signup-form/marketo-form-data'
import SignupHeader from './components/signup-header'
import { NewsletterSignupForm } from './components/newsletter-signup-form'

import s from './signup-form-area.module.css'

export function SignupFormArea() {
	return (
		<div className={s.root}>
			<div className={s.form}>
				<SignupHeader />
				<NewsletterSignupForm
					marketoFormData={marketoFormData}
					appearance="dark"
				/>
			</div>
		</div>
	)
}
