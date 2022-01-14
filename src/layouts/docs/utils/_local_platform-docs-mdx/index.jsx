import s from './style.module.css'
import React from 'react'
import { useCurrentProduct } from 'contexts'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import TabsBase, { Tab } from '@hashicorp/react-tabs'
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import DocsAnchor from 'components/docs-anchor'

// This function returns a simple object containing the default components
// The `additionalComponents` param is purely for convenience.
// It is intended for use with `next-mdx-remote`.
export default function defaultMdxComponents({ additionalComponents = {} }) {
  return Object.assign(_defaultComponents(), additionalComponents)
}

// Purely for sharing between the two functions. Once `createMdxProvider` is
// deprecated, this can be moved inline.
function _defaultComponents() {
  const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
    theme: 'dark',
  })
  return {
    Tabs,
    Tab,
    EnterpriseAlert,
    CodeBlockConfig,
    CodeTabs,
    pre,
    a: DocsAnchor,
  }
}

//
// Base components need to be slightly modified
// to fit our use cases in dev-portal
//
function EnterpriseAlert(props) {
  const currentProduct = useCurrentProduct()
  return <EnterpriseAlertBase product={currentProduct?.slug} {...props} />
}

// Tabs is a general-purpose component that we format for ease of use within mdx
// It is also wrapped in a span with a css module class for styling overrides
function Tabs({ defaultTabIdx, children }) {
  if (!Array.isArray(children))
    throw new Error('Multiple <Tab> elements required')

  return (
    <span className={s.tabsRoot}>
      <TabsBase className="g-tabs" defaultTabIdx={defaultTabIdx}>
        {children}
      </TabsBase>
    </span>
  )
}
