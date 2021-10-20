import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconUnlock24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.805 3.758A4.636 4.636 0 0118 2.5c1.205 0 2.354.456 3.195 1.258.84.8 1.305 1.877 1.305 2.992a.75.75 0 001.5 0 5.632 5.632 0 00-1.77-4.079A6.136 6.136 0 0018 1c-1.58 0-3.102.597-4.23 1.671A5.632 5.632 0 0012 6.75V10H3.75A2.75 2.75 0 001 12.75v7.5A2.75 2.75 0 003.75 23h10.5A2.75 2.75 0 0017 20.25v-7.5A2.75 2.75 0 0014.25 10h-.75V6.75c0-1.115.465-2.192 1.305-2.992zM3.75 11.5c-.69 0-1.25.56-1.25 1.25v7.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-7.5c0-.69-.56-1.25-1.25-1.25H3.75z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
