import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconArrowRight16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.235 4.045a.75.75 0 111.03-1.09l4.5 4.25a.75.75 0 010 1.09l-4.5 4.25a.75.75 0 01-1.03-1.09L11.364 8.5H2.75a.75.75 0 010-1.5h8.614L8.235 4.045z"
        />
      </svg>
    )
  }
)
