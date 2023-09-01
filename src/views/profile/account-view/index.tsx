/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import AuthenticatedView from 'views/authenticated-view'
import Text from 'components/text'
import Heading from 'components/heading'
import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import ButtonLink from 'components/button-link'
import EmptyState from 'components/empty-state'
import { ProfileSidebar } from '../sidebar'

import s from './account-view.module.css'
import useAuthentication from 'hooks/use-authentication'
import ContentHeaderCard from 'components/content-header-card'

export default function ProfileAccountView() {
	return (
		<AuthenticatedView>
			<SidebarSidecarLayout
				breadcrumbLinks={[
					{ title: 'Developer', url: '/' },
					{ title: 'Profile' },
					{
						title: 'Account',
						url: '/profile/account',
						isCurrentPage: true,
					},
				]}
				AlternateSidebar={ProfileSidebar}
				sidebarNavDataLevels={[]}
			>
				<ProfileAccountViewContent />
			</SidebarSidecarLayout>
		</AuthenticatedView>
	)
}

const ProfileAccountViewContent = () => {
	const { user } = useAuthentication()

	return (
		<div>
			<Heading level={1} weight="bold" size={500}>
				Account
			</Heading>
			<Text className={s.subheading}>
				A read-only view of personal account info
			</Text>

			{/* <Heading level={2} weight="bold" size={300}>
				Your ID
			</Heading> */}
			{/* <Text>{user?.id}</Text> */}
			<ContentHeaderCard
				description={user?.name}
				title="Your Name"
				note="Hello there!"
				buttons={[
					{
						text: 'Copy',
						isPrimary: true,
						onClick: () => {
							navigator.clipboard.writeText(user?.name)
						},
					},
				]}
			/>

			<div style={{ height: 24 }} />

			<ContentHeaderCard
				description={<code>{user?.id}</code>}
				title="Your ID"
				note="Your ID within HashiCorp"
				buttons={[
					{
						text: 'Copy',
						isPrimary: true,
						onClick: () => {
							navigator.clipboard.writeText(user?.id)
						},
					},
				]}
			/>
		</div>
	)
}
