import { useEffect, useRef, useState } from 'react'
import useWindowSize from 'hooks/use-window-size'
import useScrollPosition from 'hooks/use-scroll-position'
import useTimeCounter from './use-time-counter'

function getCoords(elem) {
  // crossbrowser version
  const box = elem.getBoundingClientRect()

  const body = document.body
  const docEl = document.documentElement

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const clientLeft = docEl.clientLeft || body.clientLeft || 0

  const top = box.top + scrollTop - clientTop
  const left = box.left + scrollLeft - clientLeft

  return { top: Math.round(top), left: Math.round(left) }
}

function getDocumentHeight() {
  const body = document.body,
    html = document.documentElement

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )
  return height
}

const BUFFER = 8
const ANCHOR_LINK_OFFSET = 68 + 24

function useAnchorLinkViz() {
  const timedUpdateCounter = useTimeCounter(500)
  const [headingData, setHeadingData] = useState<$TSFixMe[]>([])
  const elemRef = useRef<HTMLDivElement>()
  const { height, width } = useWindowSize()
  const scrollY = useScrollPosition()

  useEffect(() => {
    const elem = elemRef.current
    if (elem) {
      const documentHeight = getDocumentHeight()
      const maxScrollY = documentHeight - height
      const mainElem = elem.closest('main')
      const headings: HTMLElement[] = Array.from(
        mainElem.querySelectorAll('h1,h2')
      )
      const validHeadings = headings.filter((h) => h.getAttribute('id'))
      const dataWithPosns = validHeadings.map((heading) => {
        const id = heading.getAttribute('id')
        const nodeName = heading.nodeName
        const level = parseInt(nodeName.replace(/[^\d]/g, ''))
        const { top } = getCoords(heading)
        const rawPosnTop = Math.max(0, top - ANCHOR_LINK_OFFSET)
        const posnTop = Math.min(rawPosnTop, maxScrollY)
        // const posnTop = rawPosnTop
        return { id, nodeName, level, top, rawPosnTop, posnTop }
      })
      // const newHeadingData = dataWithPosns
      const itemCount = dataWithPosns.length
      const newHeadingData = dataWithPosns.reduce((acc, heading, idx) => {
        // start & end
        // const isFirstItem = idx === 0
        const isLastItem = idx === itemCount - 1
        const isLoneItem = itemCount == 0
        const rawItemStart = acc.length == 0 ? 0 : acc[idx - 1].itemEnd + BUFFER
        // Handle case where multiple headings are outside the scrollable area
        const itemStart = Math.min(rawItemStart, maxScrollY - 64)
        const itemEnd =
          isLoneItem || isLastItem
            ? maxScrollY
            : heading.posnTop +
              (dataWithPosns[idx + 1].posnTop - heading.posnTop) * 0.4
        acc.push({ ...heading, itemStart, itemEnd })
        return acc
      }, [])
      setHeadingData(newHeadingData)
    }
  }, [height, width, timedUpdateCounter])

  return { height, width, scrollY, headingData, elemRef, timedUpdateCounter }
}

export default useAnchorLinkViz
