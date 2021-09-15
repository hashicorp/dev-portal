## Usage

```
npx @hashicorp/docs-preview@docs-preview
```

## Set up in {product}/website

1. Move `public/*` into a new `website/assets` folder
   - Before running the preview, this `assets` folder is copied into a NextJS `public` folder
   - So, move `public/img` to `assets/img`, for example
   - Some files in `public` may not need to be moved, eg favicon. But not a big deal to worry about these, for now.
2. Delete everything Next.js-related, except `redirects` (for now)

   - Generally you'll be left with:

     - `assets`
     - `content`
     - `data`
     - `LICENSE`
     - `redirects`

   - Create a new `.gitignore` with the following contents:

     ```
     node_modules
     .DS_Store

     # preview output
     .next
     out

     # preview
     components
     pages
     public
     # As per Next.js conventions (https://nextjs.org/docs/basic-features/environment-variables#default-environment-variables)
     .env*.local
     .env.consul
     .env.waypoint
     tsconfig.json
     next-env.d.ts
     next.config.js
     npm-shrinkwrap.json
     package.json
     prettier.config.js
     .eslintrc.js
     .stylelintrc.js
     vercel.json
     ```

   - Commit these changes

3. Run `npx @hashicorp/docs-preview@docs-preview` to start local preview
4. You can clean up the mess the above command makes with `git clean -Xdf`
5. Create convenience scripts
   - Create a new `clean` script file, with contents `git clean -Xdf`, and `chmod u+x ./clean`
   - Create a new `start` script file, with contents `npx @hashicorp/docs-preview@docs-preview`, and `chmod u+x ./start`
   - Now you can run `./start` to start local preview, and `./clean` to clean up after it

## Random notes

- [x] `.env` varies by product
  - for now, have a messy bash script that handles this
  - must be a better solution longer term... maybe even just committing eg `.env.waypoint` and then doing a rename in the bash script might be preferable.
- [x] Providing args for nav-data and content dirs feels unnecessary
  - Maybe we can assume defaults for these
  - I think they are already consistent across docs product repos.
- [x] `additionalComponents` may vary across products
  - A simple, but perhaps not-ideally-performant fix would be to include all possible `additionalComponents`
  - taking this "everything" approach for now
- [x] Use `next-remote-watch`
- [ ] Is it possible to source `.gitignore` from this package, and omit from VCS in product repos?
- [ ] Redirects should likely be in this package as well
- [ ] Write up RFC
  - This "copy and paste" approach is basic, that's part of what's attractive about it
  - Pivoting is something we're prepared to do
    - eg, slim site vs full site
    - adding authoring capabilities - could be part of full site
    - one issue might be sensitive `.env` things
