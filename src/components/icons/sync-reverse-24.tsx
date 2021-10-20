import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSyncReverse24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 3.5a8.5 8.5 0 018.5 8.5.75.75 0 001.5 0c0-5.523-4.477-10-10-10a9.977 9.977 0 00-7.5 3.386V2.75a.75.75 0 00-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5H5.519A8.48 8.48 0 0112 3.5zM2.75 11.25A.75.75 0 002 12c0 5.523 4.477 10 10 10a9.977 9.977 0 007.5-3.386v2.636a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.731A8.5 8.5 0 013.5 12a.75.75 0 00-.75-.75z" />
        </g>
      </svg>
    )
  }
)
