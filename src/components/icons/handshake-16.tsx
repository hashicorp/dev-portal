import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconHandshake16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path
            d="M5 2.75a.75.75 0 00-.53.22l-.78.78H.75a.75.75 0 000 1.5H2v5a.75.75 0 01-.75.75h-.5a.75.75 0 000 1.5h.5a2.25 2.25 0 002.016-1.25h.557l3.063 1.531a2.25 2.25 0 002.254-.14l2.087-1.391h1.507a2.25 2.25 0 002.016 1.25h.5a.75.75 0 000-1.5h-.5a.75.75 0 01-.75-.75v-5h1.25a.75.75 0 000-1.5h-2.94l-.78-.78a.75.75 0 00-.53-.22H5zm-1 2.5h-.5v4.5H4a.75.75 0 01.335.08l3.222 1.61a.75.75 0 00.751-.047l1.652-1.101-.584-.876a.75.75 0 011.248-.832l.777 1.166H12.5v-4.5H12a.75.75 0 01-.53-.22l-.78-.78H8.81L7.065 5.997a.711.711 0 00.971 1.038l.971-.85a.75.75 0 11.988 1.13l-.971.85a2.211 2.211 0 01-3.02-3.229l.686-.686H5.311l-.78.78A.75.75 0 014 5.25z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path d="M1.25 9.625a.625.625 0 11-1.25 0 .625.625 0 011.25 0zM16 9.625a.625.625 0 11-1.25 0 .625.625 0 011.25 0z" />
        </g>
      </svg>
    )
  }
)
