import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconDocs24 = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          d="M5.75 1A2.75 2.75 0 003 3.75v16.5A2.75 2.75 0 005.75 23h13.5A1.75 1.75 0 0021 21.25V2.75A1.75 1.75 0 0019.25 1H5.75zM19.5 17.5V2.75a.25.25 0 00-.25-.25H5.75c-.69 0-1.25.56-1.25 1.25V17.8c.375-.192.8-.3 1.25-.3H19.5zm-15 2.75c0 .69.56 1.25 1.25 1.25h13.5a.25.25 0 00.25-.25V19H5.75c-.69 0-1.25.56-1.25 1.25z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
