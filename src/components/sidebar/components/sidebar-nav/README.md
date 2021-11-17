# SidebarNav

🚧 This component and its docs are currently a work in progress.

- The `menubar` WAI-ARIA role was chosen for this component because it is a menu that is "visually persistent", or always visible. Because elements with the role `menubar` are usually presented horizontally, but it is not being done so in this component, `aria-orientation` has to be set to `vertical`.
- The label for this component is visible, so `aria-labelledby` is set on the element with `role="menubar"` to reference the label and give this component an accessible name.

## Resources

- [`menubar` (role)](https://www.w3.org/TR/wai-aria-1.1/#menubar)
- [`aria-orientation` (property)](https://www.w3.org/TR/wai-aria-1.1/#aria-orientation)
