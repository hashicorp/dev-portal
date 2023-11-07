/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CardLink from 'components/card-link'
import Heading from 'components/heading'
import Text from 'components/text'
import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductInstallView from 'views/product-install-view'
import { generateGetStaticProps } from 'views/product-install-view/server'
import viewStyles from 'views/product-install-view/product-install-view.module.css'
import s from './consul-downloads.module.css'

const notesListItems = [
	'Use Armelv5 for all 32-bit armel systems',
	'Use Armhfv6 for all armhf systems with v6+ architecture',
	'Use Arm64 for all v8 64-bit architectures',
]

const ConsulDownloadsMerchandisingSlot = () => {
	return (
		<div>
			<Heading
				className={viewStyles.heading2}
				level={2}
				size={300}
				weight="bold"
			>
				Note for ARM users
			</Heading>
			<ul className={s.notesList}>
				{notesListItems.map((item, index) => (
					<Text
						asElement="li"
						className={s.notesListItem}
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						size={200}
						weight="regular"
					>
						{item}
					</Text>
				))}
			</ul>
			<Text
				asElement="p"
				className={s.codeDescription}
				size={200}
				weight="regular"
			>
				The following commands can help determine the right version for your
				system:
			</Text>
			<code className={s.inlineCode}>$ uname -m</code>
			<code className={s.inlineCode}>
				$ readelf -a /proc/self/exe | grep -q -c Tag_ABI_VFP_args && echo
				&quot;armhf&quot; || echo &quot;armel&quot;
			</code>

			<Heading
				className={viewStyles.heading2}
				level={2}
				size={300}
				weight="bold"
			>
				Consul tools
			</Heading>
			<CardLink
				ariaLabel="Download Consul tools"
				href="/consul/docs/integrate/download-tools"
			>
				<Text
					asElement="p"
					className={s.downloadToolsCardTitle}
					size={300}
					weight="semibold"
				>
					Download Consul tools
				</Text>
				<Text
					asElement="p"
					className={s.downloadToolsCardDescription}
					size={200}
					weight="regular"
				>
					From this page you can download various tools for Consul. These tools
					are maintained by HashiCorp and the Consul Community.
				</Text>
			</CardLink>
		</div>
	)
}

const ConsulDownloadsPage = (props) => {
	return (
		<ProductInstallView
			{...props}
			merchandisingSlot={{
				position: 'below',
				slot: <ConsulDownloadsMerchandisingSlot />,
			}}
		/>
	)
}

const getStaticProps = generateGetStaticProps(consulData as ProductData)

export { getStaticProps }
export { ConsulDownloadsMerchandisingSlot }
export default ConsulDownloadsPage
