import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconServerCluster16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M8 0a2.25 2.25 0 00-.75 4.372v.465a3.25 3.25 0 00-1.797 1.144l-.625-.366a2.25 2.25 0 10-1.038 1.13l1.026.602a3.261 3.261 0 000 1.306l-1.026.601a2.25 2.25 0 101.038 1.13l.625-.366a3.25 3.25 0 001.797 1.145v.465a2.25 2.25 0 101.5 0v-.465a3.25 3.25 0 001.797-1.145l.625.366a2.25 2.25 0 101.038-1.13l-1.026-.6a3.26 3.26 0 000-1.307l1.026-.601a2.25 2.25 0 10-1.038-1.13l-.625.365A3.251 3.251 0 008.75 4.837v-.465A2.25 2.25 0 008 0zm-.75 2.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM2.75 4a.75.75 0 100 1.5.75.75 0 000-1.5zm0 6.5a.75.75 0 100 1.5.75.75 0 000-1.5zm4.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm6-3.25a.75.75 0 100 1.5.75.75 0 000-1.5zm0-6.5a.75.75 0 100 1.5.75.75 0 000-1.5zM6.395 7.3a1.75 1.75 0 113.21 1.4 1.75 1.75 0 01-3.21-1.4z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
