import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import { UserData } from 'types/auth'

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

export { getUserMeta }
