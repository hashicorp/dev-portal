/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement } from 'react'

// HashiCorp imports
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'

// Global imports
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import { useCurrentProduct } from 'contexts'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'

import Link from 'components/link'
import { ReleaseVersion } from 'lib/fetch-release-data'
import s from './release-information.module.css'
import CardWithLink from '../card-with-link'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

const NoteCard = ({ selectedRelease }) => {
	const currentProduct = useCurrentProduct()
	const { name, shasums, shasums_signature, version } = selectedRelease

	return (
		<CardWithLink
			type="info"
			heading="Note"
			subheading={
				<>
					You can find the{' '}
					<InlineLink
						href={`https://releases.hashicorp.com/${name}/${version}/${shasums}`}
						textSize={200}
					>
						SHA256 checksums for {currentProduct.name} {version}
					</InlineLink>{' '}
					online and you can{' '}
					<InlineLink
						href={`https://releases.hashicorp.com/${name}/${version}/${shasums_signature}`}
						textSize={200}
					>
						verify the checksums signature file
					</InlineLink>{' '}
					which has been signed using{' '}
					<InlineLink href="https://www.hashicorp.com/security" textSize={200}>
						{"HashiCorp's GPG key"}
					</InlineLink>
					.
				</>
			}
			icon={<IconInfo16 className={s.cardIcon} />}
		/>
	)
}

const ChangelogNote = ({ selectedRelease }) => {
	const { name, version } = selectedRelease
	const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

	return (
		<>
			<CardWithLink
				heading="Changelog"
				subheading={`${capitalizedName} Version: ${version}`}
				link={
					<Link
						className={s.cardLink}
						aria-label={`${name} version ${version} changelog`}
						href={`https://github.com/hashicorp/${name}/releases/tag/v${version}`}
						opensInNewTab={true}
					>
						<Text asElement="span" weight="medium" size={200}>
							GitHub
						</Text>
						<IconExternalLink16 />
					</Link>
				}
			/>
		</>
	)
}

const EnterpriseLegalNote = () => {
	return (
		<CardWithLink
			type="info"
			heading="Terms of use"
			subheading="The following shall apply unless your organization has a separately signed Enterprise License Agreement or Evaluation Agreement governing your use of the package: Enterprise packages in this repository are subject to the license terms located in the package. Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not accept the terms, do not use the package."
			icon={<IconInfo16 className={s.cardIcon} />}
		/>
	)
}

const OfficialReleasesCard = () => {
	return (
		<CardWithLink
			heading="Official releases"
			subheading="All officially supported HashiCorp release channels and their security guarantees."
			link={
				<Link
					className={s.cardLink}
					aria-label="Official releases"
					href="https://www.hashicorp.com/official-release-channels"
					opensInNewTab={true}
				>
					<Text asElement="span" weight="medium" size={200}>
						View all
					</Text>
					<IconExternalLink16 />
				</Link>
			}
		/>
	)
}

interface ReleaseInformationSectionProps {
	selectedRelease: ReleaseVersion
	isEnterpriseMode: boolean
}

const ReleaseInformationSection = ({
	selectedRelease,
	isEnterpriseMode,
}: ReleaseInformationSectionProps): ReactElement => {
	return (
		<>
			<Heading
				className={viewStyles.heading2}
				level={2}
				size={300}
				id="looking-for-more"
				weight="bold"
			>
				Release Information
			</Heading>
			<ChangelogNote selectedRelease={selectedRelease} />
			<OfficialReleasesCard />
			<NoteCard selectedRelease={selectedRelease} />
			{isEnterpriseMode ? <EnterpriseLegalNote /> : null}
		</>
	)
}

export default ReleaseInformationSection
