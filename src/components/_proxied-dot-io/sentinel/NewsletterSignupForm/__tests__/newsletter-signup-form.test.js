import { screen, render } from '@testing-library/react'
import NewsletterSignupForm from '../'
import { marketoFormData } from '../marketoFormData'

describe('NewsletterSignupForm', () => {
	render(
		<NewsletterSignupForm
			marketoFormData={marketoFormData}
			buttonText={'Sign up now'}
		/>
	)

	it('renders the submit button with the buttonText prop', () => {
		expect(screen.getByText('Sign up now')).toBeInTheDocument()
	})
})
