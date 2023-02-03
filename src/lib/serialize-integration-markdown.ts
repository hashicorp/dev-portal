import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import { paragraphCustomAlerts, typography } from '@hashicorp/remark-plugins'
import rehypePrism from '@mapbox/rehype-prism'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeSanitize, { schema } from 'lib/remark-plugins/rehype-sanitize'

// TODO: export types from `next-mdx-remote` v3
const SERIALIZE_OPTIONS: Parameters<typeof serialize>[1] = {
	mdxOptions: {
		remarkPlugins: [paragraphCustomAlerts, typography],
		rehypePlugins: [
			[rehypePrism, { ignoreMissing: true }],
			rehypeSurfaceCodeNewlines,
			[rehypeSanitize, schema],
		],
	},
}

export default async function serializeIntegrationMarkdown(
	markdown: string
): Promise<MDXRemoteSerializeResult> {
	const dev_additions = [
		'# Heading One',
		`This is some _emphasized markdown_ that should appear anywhere integrations **bold markdown** is rendered. Here's an [inline link](https://www.example.com). Here's [\`linked inline code\`](https://dev.hashicorp.com).`,
		'## Heading Two',
		`Here's a code block, in \`bash\`.`,
		`\`\`\`bash\necho "something"\n\`\`\``,
		`Here's another code block, in \`go\` syntax.`,
		`\`\`\`go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n\`\`\``,
		'### Heading Three',
		`Here are some custom alert elements:`,
		`=> **Success**: This is a custom alert element.`,
		`-> **Info**: This is a custom alert element.`,
		`~> **Warning**: This is a custom alert element.`,
		`!> **Danger**: This is a custom alert element.`,
		`Note that new alert elements, such as \`MdxHighlight\`, will not work, as \`rehype-sanitize\` strips all \`jsx\` nodes from the incoming syntax tree.`,
		'#### Heading Four',
		`Here are two different lists. First, an unordered list.`,
		`- Item one\n- Item Two\n  - Indented item\n- Item Three`,
		`Next, an ordered list.`,
		`1. Item one\n2. Item Two\n   1. Indented item\n3. Item Three`,
		'##### Heading Five',
		'###### Heading Six',
		`## Attempted Malicious Stuff Below`,
		`The code after this paragraph should not result in a message logged to the console.`,
		`<div>{(() => console.info('Whoops, we let someone call arbitrary JavaScript from MDX content!'))()}</div>`,
		// Note: script tags don't work in MDX anyways.
		// `<script type="text/javascript">console.log('double pwned')</script>`,
		`There should not be a button rendered below this paragraph. \`<button />\` elements are stripped from markdown.`,
		`<button class="button" onClick={() => alert("pwned")}>This is a nice README</button>`,
		`The link in the paragraph below should not pop up an alert with your \`document.cookie\` contents. Instead, it should have its URL stripped.`,
		`[Click Here to Double Your RAM](javascript:window.onerror=alert(document.cookie))`,
		`The link below should not pop up an alert that says \`"triple pwned"\`.`,
		`<a class="html" href="javascript:alert('triple pwned')">Just an innocuous link</a>`,
		`The \`<style />\` tag below should not render. If it does, you'll definitely notice, because the background of the entire page will be light pink.`,
		`<style>{\`html {background: lightpink; /* Style tags can allow for CSS injection, and XSS on certain browsers*/\`}}</style>`,
	]
	const dev_markdown = markdown + `\n\n` + dev_additions.join('\n\n')
	return await serialize(dev_markdown, SERIALIZE_OPTIONS)
}
