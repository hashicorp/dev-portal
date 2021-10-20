import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconBriefcase24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.75 2A2.75 2.75 0 007 4.75V6H3.75A2.75 2.75 0 001 8.75v10.5A2.75 2.75 0 003.75 22h16.5A2.75 2.75 0 0023 19.25V8.75A2.75 2.75 0 0020.25 6H17V4.75A2.75 2.75 0 0014.25 2h-4.5zm6.75 5.5h-9v13h9v-13zm1.5 13v-13h2.25c.69 0 1.25.56 1.25 1.25v10.5c0 .69-.56 1.25-1.25 1.25H18zM3.75 7.5H6v13H3.75c-.69 0-1.25-.56-1.25-1.25V8.75c0-.69.56-1.25 1.25-1.25zM15.5 6V4.75c0-.69-.56-1.25-1.25-1.25h-4.5c-.69 0-1.25.56-1.25 1.25V6h7z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
