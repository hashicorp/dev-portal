import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconArrowUp16 = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          d="M4.045 7.765a.75.75 0 11-1.09-1.03l4.25-4.5a.75.75 0 011.09 0l4.25 4.5a.75.75 0 01-1.09 1.03L8.5 4.636v8.614a.75.75 0 01-1.5 0V4.636L4.045 7.765z"
        />
      </svg>
    )
  }
)
