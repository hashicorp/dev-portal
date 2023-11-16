/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement } from 'react'

// HashiCorp imports
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconExternalLink24 } from '@hashicorp/flight-icons/svg-react/external-link-24'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import CodeBlock from '@hashicorp/react-code-block'

// Global imports
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import { useCurrentProduct } from 'contexts'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import InlineAlert from 'components/inline-alert'
import MobileStandaloneLink from 'components/mobile-standalone-link'
import { ReleaseVersion } from 'lib/fetch-release-data'
import CardWithLink from '../card-with-link'
import s from './release-information.module.css'

const NoteCard = ({ selectedRelease }) => {
	const currentProduct = useCurrentProduct()
	const { name, shasums, shasums_signature, version } = selectedRelease
	return (
		<>
			<InlineAlert
				className={s.alert}
				color="neutral"
				title="Note"
				description={
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
						<InlineLink
							href="https://www.hashicorp.com/security"
							textSize={200}
						>
							{"HashiCorp's GPG key"}
						</InlineLink>
						.
						{currentProduct.name === 'Consul' && (
							<>
								<Text
									className={s.notesSubheading}
									size={200}
									weight="semibold"
								>
									ARM users
								</Text>
								<ul className={s.notesList}>
									{armNotes.map((item, index) => (
										<Text
											asElement="li"
											// eslint-disable-next-line react/no-array-index-key
											key={index}
											size={200}
											weight="regular"
										>
											{item}
										</Text>
									))}
								</ul>
							</>
						)}
					</>
				}
				icon={<IconInfo16 className={s.cardIcon} />}
			/>
			{currentProduct.name === 'Consul' && (
				<>
					<Text
						className={s.codePrompt}
						asElement="p"
						size={100}
						weight="regular"
					>
						The following commands can help determine the right version for your
						system:
					</Text>
					<CodeBlock
						className={s.codeBlock}
						code={`$ uname -m
$ readelf -a /proc/self/exe | grep -q -c Tag_ABI_VFP_args && echo "armhf" || echo "armel"`}
						language="shell-session"
						options={{ showClipboard: true, wrapCode: true }}
					/>
				</>
			)}
		</>
	)
}

const ConsulNoteCard = (): ReactElement => {
	return (
		<InlineAlert
			className={s.armUserNote}
			color="neutral"
			title="Note for ARM users"
			description={
				<>
					<ul className={s.notesList}>
						<Text asElement="li" size={200} weight="regular">
							Use Arm for all 32-bit systems
						</Text>
						<Text asElement="li" size={200} weight="regular">
							Use Arm64 for all 64-bit architectures
						</Text>
					</ul>
					<Text
						className={s.codePrompt}
						asElement="p"
						size={100}
						weight="regular"
					>
						The following commands can help determine the right version for your
						system:
					</Text>
					<CodeBlock
						code="$ uname -m"
						language="shell-session"
						options={{
							wrapCode: true,
							showClipboard: true,
						}}
					/>
					<CodeBlock
						className={s.codeBlock}
						code={`$ readelf -a /proc/self/exe | grep -q -c Tag_ABI_VFP_args && echo "armhf" || echo "armel"`}
						language="shell-session"
						options={{
							wrapCode: true,
							showClipboard: true,
						}}
					/>
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
					<MobileStandaloneLink
						ariaLabel={`${name} version ${version} changelog`}
						href={`https://github.com/hashicorp/${name}/releases/tag/v${version}`}
						size16Icon={<IconExternalLink16 />}
						size24Icon={<IconExternalLink24 />}
						iconPosition="trailing"
						opensInNewTab
						text="GitHub"
					/>
				}
			/>
		</>
	)
}

const EnterpriseLegalNote = () => {
	return (
		<InlineAlert
			className={s.alert}
			title="Terms of use"
			description={
				<Text className={s.contentSubheading} size={200} weight="regular">
					The following shall apply unless your organization has a separately
					signed Enterprise License Agreement or Evaluation Agreement governing
					your use of the package: Enterprise packages in this repository are
					subject to the license terms located in the package. Please read the
					license terms prior to using the package. Your installation and use of
					the package constitutes your acceptance of these terms. If you do not
					accept the terms, do not use the package.
				</Text>
			}
			color="highlight"
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
				<MobileStandaloneLink
					ariaLabel="View all official releases"
					href="https://www.hashicorp.com/official-release-channels"
					size16Icon={<IconExternalLink16 />}
					size24Icon={<IconExternalLink24 />}
					iconPosition="trailing"
					opensInNewTab
					text="View all"
				/>
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
	const currentProduct = useCurrentProduct()
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
			{currentProduct.name === 'Consul' && <ConsulNoteCard />}
			{isEnterpriseMode ? <EnterpriseLegalNote /> : null}
		</>
	)
}

export default ReleaseInformationSection
