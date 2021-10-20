import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconToggleLeft24 = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
        ref={forwardedRef}
      >
        <g fill={color} fillRule="evenodd" clipRule="evenodd">
          <path d="M8 8a4 4 0 100 8 4 4 0 000-8zm-2.5 4a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
          <path d="M8 5a7 7 0 000 14h8a7 7 0 100-14H8zm-5.5 7A5.5 5.5 0 018 6.5h8a5.5 5.5 0 110 11H8A5.5 5.5 0 012.5 12z" />
        </g>
      </svg>
    )
  }
)
