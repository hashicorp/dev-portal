import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconKeyValues24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M3.75 5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5zM10.75 9a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zM3 9.75A.75.75 0 013.75 9h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 013 9.75zM3.75 13a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM3 17.75a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM10.75 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM10 13.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10.75 17a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5z" />
        </g>
      </svg>
    )
  }
)
