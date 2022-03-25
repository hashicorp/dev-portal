# ImageConfig

`ImageConfig` is used to augment images in markdown with additional properties.

## Props

- `caption` `string` - a plain text caption to show below the image.
  <details><summary>Example of `caption` in use</summary>

  ```md
  ## Verify the configuration

  Once you've verified configuration, the Vault UI should display something that's related to the image below.

  <ImageConfig caption="This is a plain text caption that will appear below the image.">

  ![The Vault UI, showing something important happening that should be mentioned in this alternate text.](/path/to/image.jpg)

  </ImageConfig>
  ```

  </details>

### Deprecated props

- 🚫 `hideBorder` `boolean` - was a boolean prop. This prop is now deprecated. Please remove borders from all images.
