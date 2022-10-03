// Third-party imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// HashiCorp imports
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import ErrorView from 'views/error-view-switcher'
import Button from 'components/button'
import Heading from 'components/heading'
import Text from 'components/text'

// Local imports
import s from './sign-up.module.css'

// Text content
const TITLE = 'Create Your Account'
const DETAILS = [
	'Use your account across HashiCorp products',
	'Track your progress in longer tutorials',
	'Bookmark tutorials you need to reference regularly',
]
const SIGN_UP_BUTTON_TEXT = 'Sign Up'
const SIGN_IN_HINT_TEXT = 'Already have an account?'
const SIGN_IN_BUTTON_TEXT = 'Sign In'

const SignUpView = () => {
	const router = useRouter()
	const { isAuthEnabled, isAuthenticated, isLoading, signIn, signUp } =
		useAuthentication()

	/**
	 * @TODO determine loading state UI
	 */
	if (isLoading) {
		return null
	}

	/**
	 * Show 404 error if auth is not enabled
	 */
	if (!isAuthEnabled) {
		return (
			<BaseNewLayout>
				<ErrorView statusCode={404} isProxiedDotIo={false} />
			</BaseNewLayout>
		)
	}

	/**
	 * Redirect to app home page if user is already authenticated
	 */
	if (isAuthenticated) {
		router.replace('/')
		return null
	}

	return (
		<div className={s.root}>
			<main className={s.main}>
				<div>
					<Link href="/">
						<a aria-label="HashiCorp Developer">
							<InlineSvg
								className={s.logo}
								src={require('./img/logo-black.svg?include')}
							/>
						</a>
					</Link>
					<Heading className={s.heading} level={1} size={500} weight="bold">
						{TITLE}
					</Heading>
					<ul className={s.list}>
						{DETAILS.map((detail: string, index: number) => {
							return (
								// eslint-disable-next-line react/no-array-index-key
								<li key={index} className={s.listItem}>
									<IconCheckCircle16 className={s.detailIcon} />
									<Text asElement="span" size={200} weight="regular">
										{detail}
									</Text>
								</li>
							)
						})}
					</ul>
					<Button
						icon={<IconUserPlus16 />}
						iconPosition="trailing"
						size="medium"
						text={SIGN_UP_BUTTON_TEXT}
						onClick={() => signUp()}
					/>
					<div className={s.signInContainer}>
						<Text size={200} weight="regular">
							{SIGN_IN_HINT_TEXT}
						</Text>
						<Button
							color="tertiary"
							icon={<IconArrowRight16 />}
							iconPosition="trailing"
							onClick={() => signIn()}
							size="medium"
							text={SIGN_IN_BUTTON_TEXT}
						/>
					</div>
				</div>
			</main>
			<aside className={s.aside}>
				<div className={s.asideGradient} />
				<div className={s.asideGraphicContainer}>
					<InlineSvg
						className={s.asideGraphic}
						/**
						 * Replace with real graphic when it's available
						 * ref: https://app.asana.com/0/1202097197789424/1202683836858983/f
						 */
						src={require('./img/aside-graphic.svg?include')}
					/>
				</div>
			</aside>
		</div>
	)
}

export default SignUpView
