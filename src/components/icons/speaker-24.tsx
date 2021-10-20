import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSpeaker24 = forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} fillRule="evenodd" clipRule="evenodd">
          <path d="M12 9a5 5 0 100 10 5 5 0 000-10zm-3.5 5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" />
          <path d="M5.75 1A2.75 2.75 0 003 3.75v16.5A2.75 2.75 0 005.75 23h12.5A2.75 2.75 0 0021 20.25V3.75A2.75 2.75 0 0018.25 1H5.75zM4.5 3.75c0-.69.56-1.25 1.25-1.25h12.5c.69 0 1.25.56 1.25 1.25v16.5c0 .69-.56 1.25-1.25 1.25H5.75c-.69 0-1.25-.56-1.25-1.25V3.75z" />
        </g>
      </svg>
    )
  }
)
