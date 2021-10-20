import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconEye24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm-2.5 4a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
          <path d="M12 3C8.135 3 5.14 5.088 3.15 7.162c-1.001 1.043-1.767 2.1-2.286 2.936-.26.417-.46.785-.6 1.074-.069.143-.127.275-.169.388a1.952 1.952 0 00-.058.177A1.024 1.024 0 000 12c0 .116.025.216.037.263.017.06.037.12.058.177.042.113.1.245.17.388.138.289.34.657.599 1.074a18.14 18.14 0 002.285 2.936C5.14 18.912 8.135 21 12 21c3.864 0 6.86-2.088 8.85-4.162 1.001-1.043 1.767-2.1 2.286-2.936.26-.417.46-.785.6-1.074.069-.143.127-.275.169-.388a1.98 1.98 0 00.058-.177c.012-.047.037-.147.037-.263 0-.116-.025-.216-.037-.263a1.98 1.98 0 00-.058-.177 4.709 4.709 0 00-.17-.388c-.139-.289-.34-.657-.599-1.074a18.146 18.146 0 00-2.285-2.936C18.86 5.088 15.865 3 12 3zM1.615 12.177a4.225 4.225 0 01-.08-.177c.02-.048.047-.107.08-.177.113-.233.287-.554.523-.934a16.641 16.641 0 012.093-2.688C6.076 6.28 8.705 4.5 12 4.5c3.294 0 5.924 1.78 7.768 3.701a16.639 16.639 0 012.094 2.688c.236.38.41.701.523.934.033.07.06.129.08.177a4.03 4.03 0 01-.08.177c-.113.233-.287.554-.523.934a16.639 16.639 0 01-2.093 2.688C17.924 17.72 15.294 19.5 12 19.5s-5.925-1.78-7.769-3.701a16.641 16.641 0 01-2.093-2.688c-.236-.38-.41-.701-.523-.934z" />
        </g>
      </svg>
    )
  }
)
