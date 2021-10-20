import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSpeaker16 = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
        ref={forwardedRef}
      >
        <g fill={color} fillRule="evenodd" clipRule="evenodd">
          <path d="M8 5.55a3.95 3.95 0 100 7.9 3.95 3.95 0 000-7.9zM5.45 9.5a2.55 2.55 0 115.1 0 2.55 2.55 0 01-5.1 0z" />
          <path d="M3.25 0A2.25 2.25 0 001 2.25v11.5A2.25 2.25 0 003.25 16h9.5A2.25 2.25 0 0015 13.75V2.25A2.25 2.25 0 0012.75 0h-9.5zM2.5 2.25a.75.75 0 01.75-.75h9.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75h-9.5a.75.75 0 01-.75-.75V2.25z" />
        </g>
      </svg>
    )
  }
)
