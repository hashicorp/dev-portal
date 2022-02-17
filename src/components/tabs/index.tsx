import {
  KeyboardEvent,
  KeyboardEventHandler,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useId } from '@react-aria/utils'
import slugify from 'slugify'
import Tab, { TabProps } from './components/tab'
import { TabsProps } from './types'
import s from './tabs.module.css'
import classNames from 'classnames'

const Tabs = ({
  ariaLabel,
  ariaLabelledBy,
  children,
  initialActiveIndex = 0,
  showAnchorLine = true,
}: TabsProps): ReactElement => {
  /**
   * Disallow rendering a `Tabs` component with only one child.
   */
  if (!Array.isArray(children) || children.length === 1) {
    throw new Error('children must be an array of multiple Tab components')
  }

  /**
   * Disallow rendering children that are not a `Tab` component.
   */
  children.forEach((tabsChild: JSX.Element) => {
    const isJSXPrimitive = typeof tabsChild.type === 'string'
    const isFunctionComponent = typeof tabsChild.type === 'function'
    const isMDXComponent = typeof tabsChild.props.mdxType === 'string'

    const isTabComponent =
      !isJSXPrimitive ||
      (isFunctionComponent && tabsChild.type === 'Tab') ||
      (isMDXComponent && tabsChild.props.mdxType === 'Tab')
    if (isTabComponent) {
      return
    }

    throw new Error(
      `Found an immediate child of \`Tabs\` that is not a \`Tab\`. You can only render \`Tab\` components within \`Tabs\`. See child with props: ${JSON.stringify(
        tabsChild.props
      )}.`
    )
  })

  /**
   * TODO: this is a temporary measure until we are able to start requiring
   * either (but not both) of these properties via TypeScript. See the block
   * comment in `./types.ts` for context.
   */
  if (ariaLabel && ariaLabelledBy) {
    throw new Error(
      'Both ariaLabel and ariaLabelledBy provided to Tabs component. Please only provide one.'
    )
  }

  /**
   * Declaring these items after checking for states where we'd throw an error.
   */
  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    initialActiveIndex
  )
  const needToFocusNewElement = useRef<boolean>(false)
  const buttonElements = useRef<{ [key in string]: HTMLButtonElement }>({})
  const uniqueId = useId()
  const rootContainerId = `Tabs-${uniqueId}`
  const numTabs = children.length
  const lastIndex = numTabs - 1

  /**
   * Used to focus the newly active tab button after everything has been
   * rerendered. The `needToFocusNewElement` ref is necessary so that this
   * effect only runs when `activeTabIndex` is updated via arrow keys. Without
   * this ref, this effect when run even when `activeTabIndex` is updated via
   * mouse click, which is unecessary here.
   */
  useLayoutEffect(() => {
    if (!needToFocusNewElement.current) {
      return
    }

    const tabButtonToFocus = buttonElements.current[activeTabIndex]
    tabButtonToFocus?.focus()
    needToFocusNewElement.current = false
  }, [activeTabIndex, children])

  /**
   * We only want to prevent default behavior for the keys that we listen for in
   * the `handleKeyUp` handler. This approach keeps us from disabling scrolling
   * using the up, down, home, and end keys.
   */
  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    const { key } = event
    const isArrowLeft = key === 'ArrowLeft'
    const isArrowRight = key === 'ArrowRight'
    const isSpaceKey = key === ' '
    const isEnterKey = key === 'Enter'

    if (isArrowLeft || isArrowRight || isSpaceKey || isEnterKey) {
      event.preventDefault()
    }
  }

  /**
   * Sets the active tab index to the previous or next tab button with the left
   * or right arrow key, respectively. Also handles wrapping focus when:
   *   - the first tab button is focused and left arrow key is pressed down
   *   - the last tab button is focused and right arrow key is pressed down
   *
   * This handler does not listen to up/down arrow events so that those keys
   * still provide their normal browser scrolling function.
   */
  const handleKeyUp = (
    event: KeyboardEvent<HTMLButtonElement>,
    tabIndex: number
  ) => {
    const { key } = event

    /**
     * Ignore space and enter keys since we automatically activate each tab with
     * the left and right arrow keys.
     */
    const isSpaceKey = key === ' '
    const isEnterKey = key === 'Enter'
    if (isSpaceKey || isEnterKey) {
      event.preventDefault()
      return
    }

    /**
     * Handle left/right arrow keys and focus wrapping.
     */
    const isFirstTab = tabIndex === 0
    const isLastTab = tabIndex === lastIndex
    const isArrowLeft = key === 'ArrowLeft'
    const isArrowRight = key === 'ArrowRight'
    if (isArrowLeft && isFirstTab) {
      needToFocusNewElement.current = true
      setActiveTabIndex(lastIndex)
    } else if (isArrowLeft) {
      needToFocusNewElement.current = true
      setActiveTabIndex((prevIndex) => prevIndex - 1)
    } else if (isArrowRight && isLastTab) {
      needToFocusNewElement.current = true
      setActiveTabIndex(0)
    } else if (isArrowRight) {
      needToFocusNewElement.current = true
      setActiveTabIndex((prevIndex) => prevIndex + 1)
    }
  }

  /**
   * Slugifies a tab's heading text and appends it to the root container ID,
   * which is unique to the main Tabs component. This is a separate function so
   * that it can be accessed by the separate map calls below where tabs and
   * their panels need to be aware of each other's element ids.
   */
  const getTabId = (heading: TabProps['heading']) => {
    return `${rootContainerId}-${slugify(heading)}`
  }

  return (
    <div className={s.root} id={rootContainerId}>
      <div
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={classNames({ [s.tablistWithAnchorLine]: showAnchorLine })}
        role="tablist"
      >
        {children.map((childTab: ReactElement, index) => {
          const { heading } = childTab.props
          const id = getTabId(heading)
          const isActive = index === activeTabIndex

          return (
            <button
              aria-controls={`${id}-tabpanel`}
              aria-selected={isActive}
              className="focus-ring-from-box-shadow"
              id={`${id}-tab`}
              key={id}
              onClick={() => setActiveTabIndex(index)}
              onKeyDown={handleKeyDown}
              onKeyUp={(e) => handleKeyUp(e, index)}
              ref={(thisButtonElement) =>
                (buttonElements.current[index] = thisButtonElement)
              }
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {heading}
            </button>
          )
        })}
      </div>
      {children.map((childTab: ReactElement, index) => {
        const { heading, children } = childTab.props
        const id = getTabId(heading)
        const isActive = index === activeTabIndex

        return (
          <div
            aria-hidden={!isActive}
            aria-labelledby={`${id}-tab`}
            id={`${id}-tabpanel`}
            key={id}
            role="tabpanel"
            tabIndex={0}
          >
            {children}
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
export { Tab }
