import Button from '@hashicorp/react-button'
import { useCurrentProduct } from 'contexts'
import { rewriteDocsUrl } from 'views/docs-view/utils/product-url-adjusters'

/**
 * This component will rewrite links to any docs paths to the dev dot context
 */

export default function MdxButton(props) {
	const currentProduct = useCurrentProduct()
	return (
		<Button
			{...props}
			url={props.url ? rewriteDocsUrl(props.url, currentProduct) : undefined}
		/>
	)
}
