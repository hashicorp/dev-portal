import React from 'react'
import classNames from 'classnames'
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import TabsBase, { Tab } from '@hashicorp/react-tabs'
import { useCurrentProduct } from 'contexts'
import DocsAnchor from 'components/docs-anchor'
import Heading from 'components/heading'
import Paragraph from 'components/paragraph'
import s from './style.module.css'

/**
 * Used by `makeHeadingElement`.
 */
const HEADING_LEVELS_TO_PROPS = {
  1: {
    size: 500,
    weight: 'bold',
  },
  2: {
    size: 400,
    weight: 'bold',
  },
  3: {
    size: 300,
    weight: 'bold',
  },
  4: {
    size: 200,
    weight: 'semibold',
  },
  5: {
    size: 200,
    weight: 'semibold',
  },
  6: {
    size: 200,
    weight: 'semibold',
  },
}

// This function returns a simple object containing the default components
// The `additionalComponents` param is purely for convenience.
// It is intended for use with `next-mdx-remote`.
export default function defaultMdxComponents({ additionalComponents = {} }) {
  return Object.assign(_defaultComponents(), additionalComponents)
}

/**
 * Returns the Heading element with its given props applied and custom props we
 * apply for styling these components in docs pages.
 */
function makeHeadingElement(level, props) {
  const customProps = HEADING_LEVELS_TO_PROPS[level]
  const className = classNames(props.className, s[`h${level}`])
  const passableProps = {
    ...customProps,
    ...props,
    className,
    level,
  }

  return <Heading {...passableProps} />
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
    h1: (props) => makeHeadingElement(1, props),
    h2: (props) => makeHeadingElement(2, props),
    h3: (props) => makeHeadingElement(3, props),
    h4: (props) => makeHeadingElement(4, props),
    h5: (props) => makeHeadingElement(5, props),
    h6: (props) => makeHeadingElement(6, props),
    p: (props) => <Paragraph {...props} className={s.p} />,
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
