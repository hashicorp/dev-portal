import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSync24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 3.5A8.5 8.5 0 003.5 12 .75.75 0 012 12C2 6.477 6.477 2 12 2a9.977 9.977 0 017.5 3.386V2.75a.75.75 0 011.5 0v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h2.731A8.48 8.48 0 0012 3.5zM21.25 11.25A.75.75 0 0122 12c0 5.523-4.477 10-10 10a9.977 9.977 0 01-7.5-3.386v2.636a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H5.519A8.5 8.5 0 0020.5 12a.75.75 0 01.75-.75z" />
        </g>
      </svg>
    )
  }
)
