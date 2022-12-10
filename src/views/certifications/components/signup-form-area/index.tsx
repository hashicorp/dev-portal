import { CertificationsContentArea } from '..'
import { marketoFormData } from './components/newsletter-signup-form/marketo-form-data'
import SignupHeader from './components/signup-header'
import { NewsletterSignupForm } from './components/newsletter-signup-form'
import s from './signup-form-area.module.css'

export function SignupFormArea() {
	return (
		<CertificationsContentArea>
			<div className={s.contentWrap}>
				<div className={s.form}>
					<SignupHeader />
					<NewsletterSignupForm
						marketoFormData={marketoFormData}
						appearance="dark"
					/>
				</div>
			</div>
		</CertificationsContentArea>
	)
}
