import React from 'react'
import classNames from 'classnames'
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import { useCurrentProduct } from 'contexts'
import DocsAnchor from 'components/docs-anchor'
import Heading from 'components/heading'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import Image from 'components/image'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'

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
  const className = classNames(props.className, devDotStyles[`h${level}`])
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
    Tabs: TabsWrapper,
    Tab,
    EnterpriseAlert,
    CodeBlockConfig,
    CodeTabs,
    pre,
    a: DocsAnchor,
    /**
     * In /docs, we want to hide image borders by default for now,
     * to match existing behaviour. Note that in /tutorials, we want
     * to show image borders by default. Later we may adjust these
     * defaults; it would likely be ideal for /docs and /tutorials
     * to have the same default behaviour.
     */
    img: ({ alt, src, title }: JSX.IntrinsicElements['img']) => (
      <Image alt={alt} src={src} title={title} noBorder={true} />
    ),
    h1: (props) => makeHeadingElement(1, props),
    h2: (props) => makeHeadingElement(2, props),
    h3: (props) => makeHeadingElement(3, props),
    h4: (props) => makeHeadingElement(4, props),
    h5: (props) => makeHeadingElement(5, props),
    h6: (props) => makeHeadingElement(6, props),
    p: (props) => <Text {...props} className={devDotStyles.p} />,
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

/**
 * Because the `defaultTabIdx` prop is being renamed to `initialActiveIndex`,
 * this wrapper ensures any use of `defaultTabIdx` is still supported in older
 * versions of docs.
 */
function TabsWrapper({ defaultTabIdx, children }) {
  return <Tabs initialActiveIndex={defaultTabIdx}>{children}</Tabs>
}
