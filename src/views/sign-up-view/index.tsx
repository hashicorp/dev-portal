import { signIn } from 'next-auth/react'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'
import InlineSvg from '@hashicorp/react-inline-svg'
import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import ErrorView from 'views/error-view-switcher'
import Button from 'components/button'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './sign-up.module.css'

const details = [
	'Use your account across HashiCorp products',
	'Track your progress in longer tutorials',
	'Bookmark tutorials you need to reference regularly',
]

const SignUpView = () => {
	const { isAuthEnabled, isAuthenticated, isLoading } = useAuthentication()

	/**
	 * @TODO determine loading state UI
	 */
	if (isLoading) {
		return null
	}

	/**
	 * Show 404 error if enable_auth is false or the user is already authenticated
	 */
	if (!isAuthEnabled || isAuthenticated) {
		return (
			<BaseNewLayout>
				<ErrorView statusCode={404} isProxiedDotIo={false} />
			</BaseNewLayout>
		)
	}

	return (
		<div className={s.root}>
			<main className={s.main}>
				<div>
					<InlineSvg
						className={s.logo}
						src={require('./img/logo-black.svg?include')}
					/>
					<Heading className={s.heading} level={1} size={500} weight="bold">
						Create Your Account
					</Heading>
					<ul className={s.list}>
						{details.map((detail: string, index: number) => {
							return (
								// eslint-disable-next-line react/no-array-index-key
								<li key={index} className={s.listItem}>
									<IconCheckCircle16 />
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
						text="Sign Up"
						onClick={() =>
							signIn('cloud-idp', null, {
								callbackUrl: '/',
								screen_hint: 'signup',
							})
						}
					/>
					<div className={s.signInContainer}>
						<Text size={200} weight="regular">
							Already have an account?
						</Text>
						<Button
							color="tertiary"
							icon={<IconArrowRight16 />}
							iconPosition="trailing"
							onClick={() => signIn('cloud-idp')}
							size="large"
							text="Sign In"
						/>
					</div>
				</div>
			</main>
			<aside className={s.aside}>
				<div className={s.asideGradient} />
				<div className={s.asideGraphicContainer}>
					<InlineSvg
						className={s.asideGraphic}
						src={require('./img/temp-graphic.svg?include')}
					/>
				</div>
			</aside>
		</div>
	)
}

export default SignUpView
