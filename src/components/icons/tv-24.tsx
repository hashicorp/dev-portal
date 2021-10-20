import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconTv24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.379 1.341a.75.75 0 10-1.258.818L10.618 6H3.75A2.75 2.75 0 001 8.75v11.5A2.75 2.75 0 003.75 23h16.5A2.75 2.75 0 0023 20.25V8.75A2.75 2.75 0 0020.25 6h-6.868l2.497-3.841a.75.75 0 00-1.258-.818L12 5.374 9.379 1.34zm2.61 6.159a.725.725 0 00.022 0h8.239c.69 0 1.25.56 1.25 1.25v11.5c0 .69-.56 1.25-1.25 1.25H3.75c-.69 0-1.25-.56-1.25-1.25V8.75c0-.69.56-1.25 1.25-1.25h8.239z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
