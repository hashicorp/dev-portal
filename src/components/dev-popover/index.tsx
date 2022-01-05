import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import Popover from 'components/popover'
import s from './style.module.css'
import VisuallyHidden from '@reach/visually-hidden'

/**
 * Renders non-interactive children into a button element,
 * and displays a popover when the button is activated.
 *
 * Intended for use with work-in-progress elements.
 * Should not be used in production.
 */
function DevPopover({
  children,
  buttonClassName,
  containerClassName,
  note,
  title = 'Note',
}: {
  children: React.ReactNode
  buttonClassName?: string
  containerClassName?: string
  note: React.ReactNode
  title?: string
}): React.ReactElement {
  const [showDialog, setShowDialog] = useState(false)
  const triggerRef = useRef(null)
  return (
    <div className={classNames(s.root, containerClassName)}>
      {children}
      <button
        className={classNames(s.button, buttonClassName)}
        ref={triggerRef}
        onClick={() => setShowDialog(!showDialog)}
      >
        <VisuallyHidden>{title}</VisuallyHidden>
      </button>
      <Popover
        themeBackground="#F7D5FF"
        triggerRef={triggerRef}
        shown={showDialog}
        setIsShown={setShowDialog}
      >
        {title ? <div className={s.label}>{title}</div> : null}
        <div className={s.note}>{note}</div>
      </Popover>
    </div>
  )
}

export default DevPopover
