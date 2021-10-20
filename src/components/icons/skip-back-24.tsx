import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSkipBack24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path
            d="M17.236 4.512C18.395 3.688 20 4.516 20 5.938v12.124c0 1.421-1.605 2.25-2.764 1.426L8.71 13.426a1.75 1.75 0 010-2.852l8.525-6.062zM18.5 5.938a.25.25 0 00-.395-.204l-8.524 6.062a.25.25 0 000 .408l8.524 6.061a.25.25 0 00.395-.203V5.938z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path d="M6 5a.75.75 0 00-1.5 0v14A.75.75 0 006 19V5z" />
        </g>
      </svg>
    )
  }
)
