import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'
import InlineSvg from '@hashicorp/react-inline-svg'
import useAuthentication from 'hooks/use-authentication'
import BaseNewLayout from 'layouts/base-new'
import ErrorView from 'views/error-view-switcher'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './sign-up.module.css'
import Button from 'components/button'
import { signIn } from 'next-auth/react'
import InlineLink from 'components/inline-link'
import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'

const SignUpPage = () => {
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
			<div className={s.left}>
				<div>
					<InlineSvg
						className={s.logo}
						src={require('./logo-black.svg?include')}
					/>
					<Heading className={s.heading} level={1} size={500} weight="bold">
						Create Your Account
					</Heading>
					<ul className={s.list}>
						<li>
							<IconCheckCircle16 />
							<Text asElement="span" size={200} weight="regular">
								Use your account across HashiCorp products
							</Text>
						</li>
						<li>
							<IconCheckCircle16 />
							<Text asElement="span" size={200} weight="regular">
								Track your progress in longer tutorials
							</Text>
						</li>
						<li>
							<IconCheckCircle16 />
							<Text asElement="span" size={200} weight="regular">
								Bookmark tutorials you need to reference regularly
							</Text>
						</li>
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
						<Text size={300} weight="regular">
							Already have an account?
						</Text>
						<Button
							className={s.signInButton}
							color="tertiary"
							icon={<IconArrowRight16 />}
							iconPosition="trailing"
							onClick={() => signIn('cloud-idp')}
							size="large"
							text="Sign In"
						/>
					</div>
				</div>
			</div>
			<div className={s.right}>
				<div className={s.rightGradient} />
				<div className={s.graphicContainer}>
					<InlineSvg
						className={s.graphic}
						src={require('./temp-graphic.svg?include')}
					/>
				</div>
			</div>
		</div>
	)
}

export default SignUpPage
