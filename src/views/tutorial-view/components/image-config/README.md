# ImageConfig

> Util component to apply styling to Markdown images

Say you're writing some MDX, and you've got an image...

```mdx
## Verify the configuration

Ensure that your dashboard looks like this:

![dashboard image](path/to/image.jpg)
```

...but you need to customize its appearance.

Wrap the image in an `<ImageConfig>`, and tweak the styling via props:

```mdx
## Verify the configuration

Ensure that your dashboard looks like this:

<ImageConfig hideBorder>

![dashboard image](path/to/image.jpg)

</ImageConfig>
```

## Props

- `hideBorder: boolean = false` — toggle the borders off.
  - **Note** — all images should have borders applied, except [old images that have borders within the actual file](https://app.asana.com/0/0/1200064497615039/f).
