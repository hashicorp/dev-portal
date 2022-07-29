import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import { UserData } from 'types/auth'
import useAuthentication from 'hooks/use-authentication'
import { UserDropdownDisclosureProps } from 'components/user-dropdown-disclosure'

const getIcon = (user: UserData) => {
	// eslint-disable-next-line @next/next/no-img-element
	return user.image ? <img alt="" src={user.image} /> : <IconUser24 />
}

const getIsSignedInWithGitHub = (user: UserData) => {
	return user.image?.includes('github')
}

const getLabel = (isSignedInWithGitHub: boolean) => {
	return `Signed in with ${isSignedInWithGitHub ? 'GitHub' : 'Email'}`
}

const getDescription = (user: UserData, isSignedInWithGitHub: boolean) => {
	return isSignedInWithGitHub ? user.nickname : user.email
}

const getUserMenuItems = ({
	signOut,
}: {
	signOut: ReturnType<typeof useAuthentication>['signOut']
}): UserDropdownDisclosureProps['items'] => {
	return [
		{
			icon: <IconBookmark16 />,
			label: 'Bookmarks',
			href: '/bookmarks',
		},
		{
			icon: <IconExternalLink16 />,
			label: 'Account Settings',
			href: 'https://portal.cloud.hashicorp.com/account-settings',
		},
		{
			icon: <IconSignOut16 />,
			label: 'Sign Out',
			onClick: () => signOut(),
		},
	]
}

const getUserMeta = (user: UserData) => {
	const icon = getIcon(user)
	const isSignedInWithGitHub = getIsSignedInWithGitHub(user)
	const label = getLabel(isSignedInWithGitHub)
	const description = getDescription(user, isSignedInWithGitHub)

	return {
		icon,
		isSignedInWithGitHub,
		label,
		description,
	}
}

export { getUserMenuItems, getUserMeta }
