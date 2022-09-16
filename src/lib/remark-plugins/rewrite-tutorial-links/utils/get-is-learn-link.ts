import { ProductOption, SectionOption } from 'lib/learn-client/types'

const learnProductOptions = Object.keys(ProductOption).join('|')
const learnSectionOptions = Object.keys(SectionOption).join('|')
const learnLink = new RegExp(
	`(learn.hashicorp.com)|(/(collections|tutorials)/(${learnProductOptions}|cloud|${learnSectionOptions})/)|^/(${learnProductOptions}|cloud)$`
)

/**
 * Matches anything that
 * - contains learn.hashicorp.com
 * - collection & tutorial routes: /collections/waypoint/some-slug or /tutorials/terraform/another-slug
 * - product hub pages i.e. /boundary /waypoint
 * - section routes i.e. /well-architected-framework
 */
const getIsLearnLink = (link: string) => {
	return learnLink.test(link)
}

export { getIsLearnLink }
