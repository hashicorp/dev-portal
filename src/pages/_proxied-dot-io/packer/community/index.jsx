/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import HashiHead from '@hashicorp/react-head'
import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import VerticalTextBlockList from '@hashicorp/react-vertical-text-block-list'
import SectionHeader from '@hashicorp/react-section-header'
import s from './style.module.css'

export default function CommunityPage() {
	return (
		<div className={s.root}>
			<HashiHead
				title="Community | Packer by HashiCorp"
				pageName="Community | Packer by HashiCorp"
			/>
			<SectionHeader
				headline="Community"
				description="Packer is an open source project with a growing community. There are active, dedicated users willing to help you through various mediums."
				use_h1={true}
			/>
			<VerticalTextBlockList
				product="packer"
				data={[
					{
						header: 'Community Forum',
						body: '<a href="https://discuss.hashicorp.com/c/packer">Packer Community Forum</a>',
					},
					{
						header: 'Discussion List',
						body: '<a href="https://groups.google.com/group/packer-tool">Packer Google Group</a>',
					},
					{
						header: 'Announcement List',
						body: '<a href="https://groups.google.com/group/hashicorp-announce">HashiCorp Announcement Google Group</a>',
					},
					{
						header: 'Bug Tracker',
						body: '<a href="https://github.com/hashicorp/packer/issues">Issue tracker on GitHub</a>. Please only use this for reporting bugs. For general help, please use the Community Forum.',
					},
					{
						header: 'Training',
						body: 'Paid <a href="https://www.hashicorp.com/training">HashiCorp training courses</a> are also available in a city near you. Private training courses are also available.',
					},
				]}
			/>
		</div>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

CommunityPage.layout = PackerIoLayout
