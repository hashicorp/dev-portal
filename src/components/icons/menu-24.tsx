import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconMenu24 = forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color}>
          <path d="M2 5.75A.75.75 0 012.75 5h18.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5.75zM2 11.75a.75.75 0 01.75-.75h18.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2.75 17a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75z" />
        </g>
      </svg>
    )
  }
)
