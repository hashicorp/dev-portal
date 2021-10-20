import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconOutline16 = forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color}>
          <path d="M6.5 7.25a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75zM4.75 3.5a.75.75 0 000 1.5h.01a.75.75 0 000-1.5h-.01zM4 7.25a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5h-.01A.75.75 0 014 7.25zM4.75 9.5a.75.75 0 000 1.5h.01a.75.75 0 000-1.5h-.01zM6.5 4.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM7.25 9.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
          <path
            d="M1 2.25A2.25 2.25 0 013.25 0h9.5A2.25 2.25 0 0115 2.25v11.5A2.25 2.25 0 0112.75 16h-9.5A2.25 2.25 0 011 13.75V2.25zm2.25-.75a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75V2.25a.75.75 0 00-.75-.75h-9.5z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
