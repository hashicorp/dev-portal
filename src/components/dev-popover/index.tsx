import React, { useRef, useState } from 'react'
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
  note,
  title = 'Note',
}: {
  children: React.ReactNode
  note: React.ReactNode
  title?: string
}): React.ReactElement {
  const [showDialog, setShowDialog] = useState(false)
  const triggerRef = useRef(null)
  return (
    <div className={s.root}>
      {children}
      <button
        className={s.button}
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
