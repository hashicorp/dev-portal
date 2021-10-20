import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconChevronsUp24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.293 11.768a.75.75 0 01-1.086-1.036l5.25-5.5a.75.75 0 011.085 0l5.25 5.5a.75.75 0 01-1.085 1.036L12 6.836l-4.707 4.932z" />
          <path d="M7.293 18.768a.75.75 0 01-1.086-1.036l5.25-5.5a.75.75 0 011.085 0l5.25 5.5a.75.75 0 01-1.085 1.036L12 13.836l-4.707 4.932z" />
        </g>
      </svg>
    )
  }
)
