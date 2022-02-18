/**
 *
 * NOTE 2/18/2022 - THIS FILE IS LARGELY COPIED FROM:
 * @hashicorp/react-product-downloads-page's utils/fetch-with-retry
 *
 */

function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Creates a wrapped fetch implementation with retries and (optional) retry delays baked-in.
 */
export function makeFetchWithRetry(
  wrappedFetch: typeof fetch,
  { retries, delay }: { retries: number; delay?: number }
): typeof fetch {
  return async (input, init) => {
    let attempts = 0

    const tryFetch = async () => {
      try {
        return await wrappedFetch(input, init)
      } catch (err) {
        attempts += 1

        if (attempts > retries) {
          throw err
        }
      }
    }

    while (attempts <= retries) {
      // if we've passed in a delay, multiple it by the number of attempts to introduce a linear backoff
      if (delay && attempts > 0) await sleep(delay * attempts)
      const result = await tryFetch()
      if (result) return result
    }

    // should never actually be returned, but is required to satisfy TS
    return new Response()
  }
}
