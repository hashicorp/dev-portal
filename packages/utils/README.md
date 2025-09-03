# `@web/utils`

> A set of commonly used util functions across HashiCorp web properities.

## Installation

Install the `@web/utils` internal package within the app's `package.json` in `dependencies`.

```
{
	"dependencies": {
		"@web/utils": "*",
	},
}
```

Once installed, you can now access the utils at `@web/utils/{package}`

## utils

### `getRevalidateTime`

Use getRevalidateTime to set the properly typed and environment-specific value for `revalidate` within your server-side data fetching functions (`getStaticProps`, `getServerSideProps`)

```tsx
import getRevalidateTime from '@web/utils/get-revalidate-time'

export async function getStaticProps({ params, ...ctx }) {
  const pageProps = await fetchPageProps()

	if (!pageProps) {
		return { notFound: true }
	}

	return {
		props: pageProps,
		revalidate: getRevalidateTime(),
	}
}
```

```tsx
import getRevalidateTime from '@web/utils/get-revalidate-time'

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  res.setHeader(
    'Cache-Control',
    `s-maxage=${getRevalidateTime()}, stale-while-revalidate`
  )

  const pageProps = await fetchPageProps()

  return {
    props: pageProps
  }
}
```
