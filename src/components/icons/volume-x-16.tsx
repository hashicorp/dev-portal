import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconVolumeX16 = forwardRef<SVGSVGElement, IconProps>(
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
            d="M7.033 2.686A1.25 1.25 0 019 3.71v8.58a1.25 1.25 0 01-1.967 1.024L3.728 11H1.25C.56 11 0 10.44 0 9.75v-3.5C0 5.56.56 5 1.25 5h2.478l3.305-2.314zM7.5 4.19L4.524 6.274a1.25 1.25 0 01-.717.226H1.5v3h2.307c.256 0 .506.079.717.226L7.5 11.809V4.19z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path d="M15.28 5.72a.75.75 0 010 1.06L14.06 8l1.22 1.22a.75.75 0 11-1.06 1.06L13 9.06l-1.22 1.22a.75.75 0 11-1.06-1.06L11.94 8l-1.22-1.22a.75.75 0 011.06-1.06L13 6.94l1.22-1.22a.75.75 0 011.06 0z" />
        </g>
      </svg>
    )
  }
)
