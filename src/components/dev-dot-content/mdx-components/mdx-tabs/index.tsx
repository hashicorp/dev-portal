import { ReactNode } from 'react'
import Tabs, { Tab } from 'components/tabs'
import s from './mdx-tabs.module.css'

const MdxTab = Tab

/**
 * In docs, we've renamed the `defaultTabIdx` prop to `initialActiveIndex`.
 * This option has no known current use in learn, so is being ignored for now.
 * If we were instead to pass Tabs directly, authors might start using
 * the renamed initialTabIndex prop, which would cause inconsistency with
 * docs.
 */
function MdxTabs({ children }: { children: ReactNode }) {
  return (
    <div className={s.tabsWrapper}>
      <Tabs allowNestedStyles>{children}</Tabs>
    </div>
  )
}

export { MdxTabs, MdxTab }
