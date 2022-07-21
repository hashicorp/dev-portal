import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'
import Heading from 'components/heading'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import { ProfileViewProps } from './types'
import s from './profile-view.module.css'

/**
 * The exported view component that handles wrapping the view content in
 * `AuthenticatedView`, which automatically handles rendering gated content.
 */
const ProfileView = ({ user }: ProfileViewProps) => {
	return (
		<AuthenticatedView>
			<ProfileViewContent user={user} />
		</AuthenticatedView>
	)
}

/**
 * The content of the ProfileView that is gated behind authentication.
 */
const ProfileViewContent = ({ user }: ProfileViewProps) => {
	const { image, ...restProperties } = user

	/**
	 * @TODO this is only temporary until the Sign Out button is placed in its
	 * permanent location. This view should not need to use this hook.
	 */
	const { signOut } = useAuthentication()

	return (
		<div className={s.root}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt="profile avatar" className={s.avatar} src={image} />
			<div>
				<Heading level={1} size={500} weight="bold">
					User Profile
				</Heading>
				<ul>
					{Object.keys(restProperties).map((property) => {
						return (
							<li key={property}>
								{property}: {user[property]}
							</li>
						)
					})}
				</ul>
				<Button color="secondary" onClick={() => signOut()} text="Sign Out" />
			</div>
		</div>
	)
}

ProfileView.layout = BaseNewLayout
export type { ProfileViewProps }
export default ProfileView
