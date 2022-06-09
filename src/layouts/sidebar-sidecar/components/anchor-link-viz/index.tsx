import Portal from 'components/portal'
import useAnchorLinkViz from './use-anchor-link-viz'
import s from './anchor-link-viz.module.css'
import React from 'react'

export default function AnchorLinkViz() {
  const { elemRef, headingData, ...restData } = useAnchorLinkViz()

  return (
    <div ref={elemRef}>
      <Portal className={s.meta}>
        <pre>
          <code>
            Magenta line is where link jumps to.
            <br />
            Blue area as intersection zone.
            <br />
            Should work even if no bottom padding.
            <br />
            Edge case with two bottom headings:
            <br />
            we&apos;ll highlight both.
            <br />
            {JSON.stringify(restData, null, 2)}
          </code>
        </pre>
      </Portal>
      <Portal className={s.viz}>
        {headingData.length
          ? headingData.map((heading) => {
              return (
                <>
                  <div
                    className={s.anchorLinkMarker}
                    style={
                      {
                        top: `${heading.top}px`,
                        height: '1px',
                        '--color': 'dodgerblue',
                      } as React.CSSProperties
                    }
                  />
                  <div
                    className={s.anchorLinkMarker}
                    style={
                      {
                        top: `${heading.rawPosnTop}px`,
                        '--color': 'blue',
                      } as React.CSSProperties
                    }
                  >
                    <pre>
                      <code>
                        Raw posn
                        <br />
                        {JSON.stringify(heading, null, 2)}
                      </code>
                    </pre>
                  </div>
                  <div
                    className={s.anchorLinkMarker}
                    style={{ top: `${heading.posnTop}px` }}
                  >
                    <pre>
                      <code>
                        {'         '}Adjusted position
                        <br />
                        {JSON.stringify(heading, null, 2)}
                      </code>
                    </pre>
                  </div>

                  <div
                    className={s.anchorAreaMarker}
                    style={{
                      top: `${heading.itemStart}px`,
                      height: `${heading.itemEnd - heading.itemStart}px`,
                    }}
                  />
                </>
              )
            })
          : null}
      </Portal>
    </div>
  )
}
