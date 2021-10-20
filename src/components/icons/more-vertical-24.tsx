import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconMoreVertical24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 3.5a2 2 0 100 4 2 2 0 000-4zM12 10a2 2 0 100 4 2 2 0 000-4zM12 16.5a2 2 0 100 4 2 2 0 000-4z" />
        </g>
      </svg>
    )
  }
)
