import { marketoFormData } from './components/newsletter-signup-form/marketo-form-data'
import SignupHeader from './components/signup-header'
import { NewsletterSignupForm } from './components/newsletter-signup-form'
// import { ErrorBoundary } from 'react-error-boundary'
// import SubmitMessage from './components/newsletter-signup-form/submit-message'
import s from './signup-form-area.module.css'

const APPEARANCE_SLUG = 'dark'

export function SignupFormArea() {
	return (
		<div className={s.root}>
			<div className={s.form}>
				<SignupHeader />
				{/* <ErrorBoundary
					FallbackComponent={() => (
						<SubmitMessage submitStatus="error" appearance={APPEARANCE_SLUG} />
					)}
				> */}
				<NewsletterSignupForm
					marketoFormData={marketoFormData}
					appearance={APPEARANCE_SLUG}
				/>
				{/* </ErrorBoundary> */}
			</div>
		</div>
	)
}
