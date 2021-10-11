import defaultMdxComponents from '@hashicorp/platform-docs-mdx'
import { MDXProviderComponentsProp } from '@mdx-js/react'
import { ReactElement } from 'react'

export default function generateComponents(
  productName: string,
  additionalComponents: MDXProviderComponentsProp = {}
): Record<string, (p: any) => ReactElement> {
  return defaultMdxComponents({
    product: productName,
    additionalComponents,
  })
}
