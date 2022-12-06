import { CertificationsContentArea } from '../../../components'
import { NewsletterSignupForm } from '../'
import { marketoFormData } from '../newsletter-signup-form/marketo-form-data'
import s from './signup-form-area.module.css'

export function SignupFormArea() {
	return (
		<div className={s.root}>
			<CertificationsContentArea>
				<h2>Stay Informed Heading</h2>
				<NewsletterSignupForm marketoFormData={marketoFormData} />
			</CertificationsContentArea>
		</div>
	)
}
