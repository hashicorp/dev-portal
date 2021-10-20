import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconMoreHorizontal16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M3.5 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM8 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12.5 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </g>
      </svg>
    )
  }
)
