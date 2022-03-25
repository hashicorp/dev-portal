import DirectionalLinkBox from './components/directional-link-box'

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
}

type LinkProps = {
  name: string
  path: string
}

export function NextPrevious({ tutorial, collection }: NextPreviousProps) {
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
     * We don't have an advanced search page, so we can't use the search query thing yet
     * should it just point to Learn?
     * if it is the last collection in the sidebar...we provide the search query path for the
     * advanced search page. for now we should just go to the product tutorial home page?
     */
    //   if (collection.isLast) {
    //     const searchLink = '/search'
    //     const isProduct = themeIsProduct(productSlug)

    //     if (isProduct) {
    //       searchLink = searchLink + `?product=${productSlug}`
    //     }

    //     if (badge) {
    //       const badgeQuery = `${isProduct ? '&' : '?'}edition=${
    //         badge.includes(':') ? badge.substring(0, badge.indexOf(':')) : badge
    //       }`
    //       searchLink = searchLink + badgeQuery
    //     }

    //     return (
    //       <DirectionalLinkBox
    //         link={{
    //           href: searchLink,
    //           as: searchLink,
    //         }}
    //         label="Browse Tutorials"
    //         direction="final"
    //         title="Browse Tutorials"
    //       />
    //     )
    //   }

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
    <div>
      {renderPreviousLink()}
      {renderNextLink()}
    </div>
  )
}
