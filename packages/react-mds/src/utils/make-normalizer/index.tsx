export type NormalizerOpts<TOut extends string> = {
	aliases?: Record<string, TOut>
	fallback?: TOut
	transform?: (raw: string) => string
}

export type Normalizer<TOut extends string> = {
	(input: unknown, opts?: NormalizerOpts<TOut>): TOut
	with(bound: NormalizerOpts<TOut>): Normalizer<TOut>
}

export function makeNormalizer<
	TAllowed extends readonly string[],
	TOut extends TAllowed[number]
>(
	allowed: TAllowed,
	defaults: {
		fallback: TOut
		aliases?: Record<string, TOut>
		transform?: (raw: string) => string
	}
): Normalizer<TOut> {
	const list = allowed as readonly string[]

	const defaultAliases: Record<string, TOut> =
		defaults.aliases ??
		(Object.fromEntries(list.map((v) => [v, v])) as Record<string, TOut>)

	const defaultTransform =
		defaults.transform ?? ((s: string) => s.trim().toLowerCase())

	const core = ((input: unknown, opts?: NormalizerOpts<TOut>): TOut => {
		const aliases = { ...defaultAliases, ...(opts?.aliases ?? {}) }
		const fallback = opts?.fallback ?? defaults.fallback
		const transform = opts?.transform ?? defaultTransform

		if (typeof input !== 'string') return fallback

		const s = transform(input)
		const candidate = (aliases[s] ?? s) as string
		return list.includes(candidate) ? (candidate as TOut) : fallback
	}) as Normalizer<TOut>

	core.with = (bound: NormalizerOpts<TOut>) =>
		((input: unknown, opts?: NormalizerOpts<TOut>) =>
			core(input, { ...bound, ...(opts ?? {}) })) as Normalizer<TOut>

	return core
}

/**
 * Group helper: normalize a whole props object in one call.
 * - `all.transform` applies to every normalizer in the set (safe cross-type).
 * - `each[key]` lets you override per-key opts (aliases/fallback/transform).
 */
export function makeNormalizerSet<TOuts extends Record<string, string>>(map: {
	[K in keyof TOuts]: Normalizer<TOuts[K]>
}) {
	type In = { [K in keyof TOuts]?: unknown | null }
	type Out = { [K in keyof TOuts]: TOuts[K] }
	type All = Pick<NormalizerOpts<string>, 'transform'> // safe cross-prop
	type Each = { [K in keyof TOuts]?: NormalizerOpts<TOuts[K]> }
	type Call = (input: In, opts?: { all?: All; each?: Each }) => Out

	const call = ((input: In, opts?: { all?: All; each?: Each }) => {
		const out = {} as Out
		for (const k in map) {
			if (!Object.prototype.hasOwnProperty.call(map, k)) continue
			const key = k as keyof TOuts
			const n = map[key]
			const base = opts?.all ? n.with(opts.all as any) : n
			out[key] = base(input?.[key], opts?.each?.[key]) as TOuts[typeof key]
		}
		return out
	}) as Call & { with(all: All): Call }

	call.with = (all: All) => {
		const bound = {} as { [K in keyof TOuts]: Normalizer<TOuts[K]> }
		for (const k in map) {
			if (!Object.prototype.hasOwnProperty.call(map, k)) continue
			const key = k as keyof TOuts
			bound[key] = map[key].with(all as any)
		}
		return makeNormalizerSet(bound)
	}

	return call
}
