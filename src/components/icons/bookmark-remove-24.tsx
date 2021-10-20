import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconBookmarkRemove24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M8.75 10a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" />
          <path
            d="M6.75 2A2.75 2.75 0 004 4.75v16.376a1 1 0 001.382.924l6.522-2.699a.25.25 0 01.192 0l6.522 2.699A1 1 0 0020 21.126V4.75A2.75 2.75 0 0017.25 2H6.75zM5.5 4.75c0-.69.56-1.25 1.25-1.25h10.5c.69 0 1.25.56 1.25 1.25v15.628l-5.83-2.413a1.75 1.75 0 00-1.34 0L5.5 20.378V4.75z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
