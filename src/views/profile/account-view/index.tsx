/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import classNames from 'classnames'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'

import useAuthentication from 'hooks/use-authentication'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import AuthenticatedView from 'views/authenticated-view'
import Text from 'components/text'
import Heading from 'components/heading'
import CopySnippet from 'components/hds-copy-snippet'
import { MDSCard } from '@components/mds-card'
import StandaloneLink from 'components/standalone-link'
import InlineLink from 'components/inline-link'

import { ProfileSidebar } from '../sidebar'
import s from './account-view.module.css'

export default function ProfileAccountView() {
	return (
		<AuthenticatedView>
			<SidebarSidecarLayout
				AlternateSidebar={ProfileSidebar}
				sidebarNavDataLevels={[]}
				breadcrumbLinks={[
					{ title: 'Developer', url: '/' },
					{
						title: 'Basic info',
						url: '/profile/account',
						isCurrentPage: true,
					},
				]}
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
				Basic info
			</Heading>
			<Text className={s.subheading}>
				A read-only view of your profile details from&nbsp;
				<InlineLink href="https://portal.cloud.hashicorp.com/account-settings">
					HCP Account settings
				</InlineLink>
			</Text>

			<Heading level={2} weight="bold" size={200} className={s.sectionTitle}>
				Primary email
			</Heading>

			<MDSCard className={s.section}>
				<Text className={s.description}>
					Email address associated with your profile name
				</Text>
				<div className={classNames('ph-no-capture', s.copySnippetWrapper)}>
					<CopySnippet textToCopy={user.email} />
				</div>
			</MDSCard>

			<Heading level={2} weight="bold" size={200} className={s.sectionTitle}>
				HashiCorp ID
			</Heading>

			<MDSCard className={s.section}>
				<Text className={s.description}>Your ID within HashiCorp</Text>
				<div className={classNames('ph-no-capture', s.copySnippetWrapper)}>
					<CopySnippet textToCopy={user.id} />
				</div>
			</MDSCard>

			<StandaloneLink
				href={'https://portal.cloud.hashicorp.com/account-settings'}
				text={'Manage account settings'}
				icon={<IconExternalLink16 />}
				iconPosition="trailing"
			/>
		</div>
	)
}
