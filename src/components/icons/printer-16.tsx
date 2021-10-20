import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconPrinter16 = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          d="M2.25 5H3V3.25A2.25 2.25 0 015.25 1h5.5A2.25 2.25 0 0113 3.25V5h.75A2.25 2.25 0 0116 7.25v3.5A2.25 2.25 0 0113.75 13H12.5v.25c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25V13H2.25A2.25 2.25 0 010 10.75v-3.5A2.25 2.25 0 012.25 5zm3-2.5a.75.75 0 00-.75.75V5h7V3.25a.75.75 0 00-.75-.75h-5.5zm-1.75 9V9.75c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v1.75h1.25a.75.75 0 00.75-.75v-3.5a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v3.5c0 .414.336.75.75.75H3.5zM11 13H5v-3h6v3z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
