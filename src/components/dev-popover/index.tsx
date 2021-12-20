import React, { useRef, useState } from 'react'
import Popover from 'components/popover'

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
    <>
      <button
        style={{
          border: 'none',
          background: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          padding: 0,
          margin: 0,
          display: 'block',
          cursor: 'pointer',
          color: 'inherit',
        }}
        ref={triggerRef}
        onClick={() => setShowDialog(!showDialog)}
      >
        {children}
      </button>
      <Popover
        themeBackground="#F7D5FF"
        triggerRef={triggerRef}
        shown={showDialog}
        setIsShown={setShowDialog}
      >
        <div
          className="g-type-label"
          style={{ color: '#9C64AA', paddingBottom: '0.75rem' }}
        >
          {title}
        </div>
        <div style={{ color: '#5B2668' }}>{note}</div>
      </Popover>
    </>
  )
}

export default DevPopover
