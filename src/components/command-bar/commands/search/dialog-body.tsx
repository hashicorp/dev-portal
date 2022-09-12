import { useCallback, useMemo } from 'react'
import { IconHistory16 } from '@hashicorp/flight-icons/svg-react/history-16'
import { useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import {
	CommandBarButtonListItem,
	CommandBarDivider,
	CommandBarLinkListItem,
	CommandBarList,
} from 'components/command-bar/components'
import ProductIcon from 'components/product-icon'

const SearchCommandBarDialogBody = () => {
	const { addTag, removeTag, currentInputValue } = useCommandBar()
	const currentProduct = useCurrentProduct()

	/**
	 * Generate a CommandBarTag object if there is a `currentProduct`.
	 */
	const currentProductTag = useMemo(() => {
		if (currentProduct) {
			return { id: currentProduct.slug, text: currentProduct.name }
		}
	}, [currentProduct])

	/**
	 * Create callback for setting up this command's state.
	 */
	const setUpCommandState = useCallback(() => {
		if (currentProductTag) {
			addTag(currentProductTag)
		}
	}, [addTag, currentProductTag])

	/**
	 * Create callback for cleaning up this command's state.
	 */
	const cleanUpCommandState = useCallback(() => {
		if (currentProductTag) {
			removeTag(currentProductTag.id)
		}
	}, [currentProductTag, removeTag])

	/**
	 * Leveraging the set up + clean up hook exposed by CommandBarDialog.
	 */
	useSetUpAndCleanUpCommandState(setUpCommandState, cleanUpCommandState)

	return (
		<>
			<p>Current search query: {currentInputValue}</p>
			<br />
			<CommandBarList label="Search Results">
				<CommandBarLinkListItem
					title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					badges={['Terraform', 'Packer', 'Nomad']}
					description="The AWS secrets engine generates AWS access credentials dynamically based on IAM policies. The AWS secrets engine generates AWS access credentials dynamically based on IAM policies."
					url="/"
				/>
				<CommandBarLinkListItem
					title="AMI Builder (EBS backed)"
					badges={['Packer']}
					description="The AWS secrets engine generates AWS access credentials dynamically based on IAM policies. The AWS secrets engine generates AWS access credentials dynamically based on IAM policies."
					url="/"
				/>
				<CommandBarLinkListItem
					title="AWS ECS"
					badges={['Consul']}
					description="The AWS secrets engine generates AWS access credentials dynamically based on IAM policies. The AWS secrets engine generates AWS access credentials dynamically based on IAM policies."
					url="/"
				/>
			</CommandBarList>
			<CommandBarDivider />
			<CommandBarList label="Recent Searches">
				<CommandBarButtonListItem
					icon={<IconHistory16 />}
					title="AWS"
					onClick={() => {
						console.log('TODO: set search query to "AWS"')
					}}
				/>
				<CommandBarButtonListItem
					icon={<IconHistory16 />}
					title="terraform install"
					onClick={() => {
						console.log('TODO: set search query to "terraform install"')
					}}
				/>
				<CommandBarButtonListItem
					icon={<IconHistory16 />}
					title="Get started"
					onClick={() => {
						console.log('TODO: set search query to "Get started"')
					}}
				/>
			</CommandBarList>
			<CommandBarDivider />
			<CommandBarList label="Suggested Pages">
				<CommandBarLinkListItem
					icon={<ProductIcon productSlug="hcp" />}
					title="HashiCorp Cloud Platform"
					url="/hcp"
				/>
				<CommandBarLinkListItem
					icon={<ProductIcon productSlug="terraform" />}
					title="Terraform"
					url="/terraform"
				/>
				<CommandBarLinkListItem
					icon={<ProductIcon productSlug="vault" />}
					title="Vault"
					url="/vault"
				/>
			</CommandBarList>
		</>
	)
}

export default SearchCommandBarDialogBody
