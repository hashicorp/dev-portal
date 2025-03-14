/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Session } from 'next-auth'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import useAuthentication from 'hooks/use-authentication'
import { UserDropdownDisclosureProps } from 'components/user-dropdown-disclosure'
import Image from 'next/image'

const getIcon = (user: Session['user']) => {
	return user.image ? <Image alt={`${user.name}'s profile picture`} src={user.image} /> : <IconUser24 />
}

const getIsSignedInWithGitHub = (user: Session['user']) => {
	return user.image?.includes('github')
}

const getLabel = (isSignedInWithGitHub: boolean) => {
	return `Signed in with ${isSignedInWithGitHub ? 'GitHub' : 'Email'}`
}

const getDescription = (
	user: Session['user'],
	isSignedInWithGitHub: boolean
) => {
	return isSignedInWithGitHub ? user.nickname : user.email
}

const getUserMenuItems = ({
	signOut,
}: {
	signOut: ReturnType<typeof useAuthentication>['signOut']
}): UserDropdownDisclosureProps['items'] => {
	return [
		{
			label: 'Basic info',
			href: '/profile/account',
		},
		{
			label: 'Bookmarks',
			href: '/profile/bookmarks',
		},
		{
			label: 'Sign out',
			onClick: () => signOut(),
		},
	]
}

const getUserMeta = (user: Session['user']) => {
	const icon = getIcon(user)
	const isSignedInWithGitHub = getIsSignedInWithGitHub(user)
	const label = getLabel(isSignedInWithGitHub)
	const description = getDescription(user, isSignedInWithGitHub)
	const id = user.id

	return {
		icon,
		isSignedInWithGitHub,
		label,
		description,
		id,
	}
}

export { getUserMenuItems, getUserMeta }
