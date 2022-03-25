import DirectionalLinkBox from './components/directional-link-box'
import s from './next-previous.module.css'

interface NextPreviousProps {
  tutorial: {
    next?: LinkProps
    previous?: LinkProps
    isLast: boolean
  }
  collection: {
    current: LinkProps
    next?: LinkProps
    isLast: boolean
  }
  finalLink: string
}

type LinkProps = {
  name: string
  path: string
}

export function NextPrevious({
  tutorial,
  collection,
  finalLink,
}: NextPreviousProps) {
  function renderPreviousLink() {
    if (tutorial.previous) {
      return (
        <DirectionalLinkBox
          label="Previous"
          link={{ href: tutorial.previous.path }}
          direction={'previous'}
          title={`Go to previous tutorial: ${tutorial.previous.name}`}
        />
      )
    }

    return (
      <DirectionalLinkBox
        link={{ href: collection.current.path }}
        label="Back to Collection"
        direction={'previous'}
        title={`Go back to collection: ${collection.current.name}`}
      />
    )
  }

  function renderNextLink() {
    if (tutorial.next && !tutorial.isLast) {
      return (
        <DirectionalLinkBox
          label="Next"
          link={{ href: tutorial.next.path }}
          direction="next"
          title={`Go to next tutorial: ${tutorial.next.name}`}
        />
      )
    }

    /**
     * @TODO - interim state for 'final' link
     * This link shows on the last tutorial in the last collection in sidebar order
     * In learn, it links to a filtered advanced search page state
     * e.g. https://learn.hashicorp.com/search?product=waypoint&page=1
     *
     * Since don't have an advanced search page for beta, were linking folks back to the base
     * product tutorials page.
     *
     */

    if (collection.isLast) {
      return (
        <DirectionalLinkBox
          link={{
            href: finalLink,
          }}
          label="Browse Tutorials"
          direction="final"
          title="Browse Tutorials"
        />
      )
    }

    return (
      <DirectionalLinkBox
        link={{ href: collection.next.path }}
        label="Next Collection"
        direction="next"
        title={`Go to next collection: ${collection.next.name}`}
      />
    )
  }
  return (
    <div className={s.linkBoxWrapper}>
      {renderPreviousLink()}
      {renderNextLink()}
    </div>
  )
}
