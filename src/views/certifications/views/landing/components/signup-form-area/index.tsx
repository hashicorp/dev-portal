import { CertificationsContentArea } from '../../../../components'
import { NewsletterSignupForm } from '..'
import { marketoFormData } from '../newsletter-signup-form/marketo-form-data'
import SignupHeader from '../signup-header'
import s from './signup-form-area.module.css'

export function SignupFormArea() {
	return (
		<div className={s.root}>
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
		</div>
	)
}
