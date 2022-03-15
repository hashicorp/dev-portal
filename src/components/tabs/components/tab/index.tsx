import { ReactElement } from 'react'
import { TabProps } from './types'

/**
 * NOTE: this component is never actually rendered. The main `Tabs` component
 * handles rendering each tab and its panel. This `Tab` component is currently
 * set up as an authoring convenience for MDX and to express the required props
 * for the component via TypeScript.
 */
const Tab = (props: TabProps): ReactElement => {
  console.error(
    `It looks like you are trying to render a \`Tab\` without placing it in a \`Tabs\` component. The \`Tab\` component does not render anything on its own. It must be used within \`Tabs\`. See \`Tab\` with props: ${JSON.stringify(
      props
    )}.`
  )

  return null
}

export type { TabProps }
export default Tab
