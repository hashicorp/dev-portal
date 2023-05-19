import {
	decodeDelimitedArray,
	encodeDelimitedArray,
	NumberParam,
	QueryParamOptions,
	StringParam,
	withDefault,
} from 'use-query-params'

const DEFAULT_COMMA_ARRAY_PARAM_VALUE = []
const DEFAULT_PAGE_SIZE_VALUE = 8
const DEFAULT_PAGE_VALUE = 1
const DEFAULT_STRING_PARAM_VALUE = ''

/**
 * Uses a comma to delimit entries. e.g. ['a', 'b'] => qp?=a,b
 * https://github.com/pbeshai/use-query-params/blob/master/packages/use-query-params/README.md?plain=1#L374-L380
 */
const CommaArrayParam = withDefault(
	{
		encode: (array: string[] | null | undefined) =>
			encodeDelimitedArray(array, ','),
		decode: (arrayStr: string | string[] | null | undefined) =>
			decodeDelimitedArray(arrayStr, ','),
	},
	DEFAULT_COMMA_ARRAY_PARAM_VALUE
)

const USE_QUERY_PARAMS_CONFIG_MAP = {
	components: CommaArrayParam,
	flags: CommaArrayParam,
	tiers: CommaArrayParam,
	types: CommaArrayParam,
	filterQuery: withDefault(StringParam, DEFAULT_STRING_PARAM_VALUE),
	page: withDefault(NumberParam, DEFAULT_PAGE_VALUE),
	pageSize: withDefault(NumberParam, DEFAULT_PAGE_SIZE_VALUE),
}

const USE_QUERY_PARAMS_OPTIONS: QueryParamOptions = {
	enableBatching: true,
	removeDefaultsFromUrl: true,
	updateType: 'replaceIn',
}

export {
	CommaArrayParam,
	DEFAULT_COMMA_ARRAY_PARAM_VALUE,
	DEFAULT_PAGE_SIZE_VALUE,
	DEFAULT_PAGE_VALUE,
	DEFAULT_STRING_PARAM_VALUE,
	USE_QUERY_PARAMS_CONFIG_MAP,
	USE_QUERY_PARAMS_OPTIONS,
}
