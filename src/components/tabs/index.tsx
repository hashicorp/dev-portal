import {
  KeyboardEvent,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import TabPanel from './components/tab'
import { TabsProps } from './types'
import s from './tabs.module.css'

const Tabs = ({
  ariaLabel,
  ariaLabelledBy,
  initialActiveIndex = 0,
  children,
}: TabsProps): ReactElement => {
  /**
   * Disallow rendering a Tabs component with only one Tab.
   */
  if (!Array.isArray(children)) {
    throw new Error('children must be an array of multiple Tab components')
  }

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
  const tablistRef = useRef<HTMLDivElement>()
  const needToFocusNewElement = useRef<boolean>(false)
  const buttonElements = useRef<{ [key in string]: HTMLButtonElement }>({})
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

    const newlyActiveChild = children[activeTabIndex] as ReactElement
    const tabButtonToFocus = buttonElements.current[newlyActiveChild.props.id]
    tabButtonToFocus?.focus()
    needToFocusNewElement.current = false
  }, [activeTabIndex, children])

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

  return (
    <div className={s.root}>
      <div
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={tablistRef}
        role="tablist"
      >
        {children.map((childTab: ReactElement, index) => {
          const { id, heading } = childTab.props
          const isActive = index === activeTabIndex

          return (
            <button
              aria-controls={`${id}-tabpanel`}
              aria-selected={isActive}
              id={`${id}-tab`}
              key={id}
              onClick={() => setActiveTabIndex(index)}
              onKeyDown={(e) => e.preventDefault()}
              onKeyUp={(e) => handleKeyUp(e, index)}
              ref={(thisButtonElement) =>
                (buttonElements.current[id] = thisButtonElement)
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
        const { id, children } = childTab.props
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
export { TabPanel }
