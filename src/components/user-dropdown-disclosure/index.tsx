import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import useAuthentication from 'hooks/use-authentication'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
} from 'components/dropdown-disclosure'
import { developmentToast, ToastColor } from 'components/toast'
import Button from 'components/button'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'

/**
 * Renders a development toast when UserDropdownDisclosure is being rendered but
 * there is no authenticated user to render the component for.
 */
const handleUnauthenticated = (action: ReturnType<typeof Button>) => {
	developmentToast({
		color: ToastColor.warning,
		title: 'Warning in UserDropdownDisclosure',
		description:
			'No user is currently signed in, so `UserDropdownDisclosure` is returning `null`.',
		renderActions: () => action,
	})
}

const UserDropdownDisclosure = () => {
	const { currentProvider, isAuthenticated, isLoading, signIn, signOut, user } =
		useAuthentication()

	// TODO determine loading state?
	if (isLoading) {
		return null
	}

	if (!isAuthenticated) {
		handleUnauthenticated(
			<Button
				color="secondary"
				onClick={() => signIn()}
				icon={<IconArrowRight16 />}
				iconPosition="trailing"
				text="Sign In"
			/>
		)
		return null
	}

	// TODO - is this the right way?
	const isSignedInWithGitHub = user.image?.includes('github')
	// eslint-disable-next-line @next/next/no-img-element
	const icon = user.image ? <img alt="" src={user.image} /> : <IconUser24 />
	const labelText = `Signed in with ${
		isSignedInWithGitHub ? 'GitHub' : 'Email'
	}`
	const descriptionText = isSignedInWithGitHub ? user.nickname : user.email

	return (
		<DropdownDisclosure aria-label="User menu" icon={icon}>
			<DropdownDisclosureLabelItem>{labelText}</DropdownDisclosureLabelItem>
			<DropdownDisclosureDescriptionItem>
				{descriptionText}
			</DropdownDisclosureDescriptionItem>
			<DropdownDisclosureSeparatorItem />
			<DropdownDisclosureLinkItem href="/bookmarks" icon={<IconBookmark16 />}>
				Bookmarks
			</DropdownDisclosureLinkItem>
			<DropdownDisclosureLinkItem
				href={currentProvider.accountSettingsUrl}
				icon={<IconExternalLink16 />}
			>
				Account Settings
			</DropdownDisclosureLinkItem>
			<DropdownDisclosureButtonItem
				icon={<IconSignOut16 />}
				onClick={() => signOut()}
			>
				Sign Out
			</DropdownDisclosureButtonItem>
		</DropdownDisclosure>
	)
}

export default UserDropdownDisclosure
