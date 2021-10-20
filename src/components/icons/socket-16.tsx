import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSocket16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M5 8a1 1 0 011-1h.01a1 1 0 010 2H6a1 1 0 01-1-1zM10.01 7a1 1 0 000 2h.01a1 1 0 100-2h-.01z" />
          <path
            d="M8 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM4 8a4 4 0 118 0 4 4 0 01-8 0z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path
            d="M2.25 0A2.25 2.25 0 000 2.25v11.5A2.25 2.25 0 002.25 16h11.5A2.25 2.25 0 0016 13.75V2.25A2.25 2.25 0 0013.75 0H2.25zM1.5 2.25a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75V2.25z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
