/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// import { ProductSlug } from 'types/products'
import { safeAnalyticsTrack } from 'lib/analytics'

interface TutorialsFrontDoorLinkClickedEvent {
	linkCategory:
		| 'certification-card'
		| 'collection-card'
		| 'featured-use-case'
		| 'product-tutorials-landing'
		| 'tutorial-library'
	linkPath: string
	// @TODO clean up types across view's code
	productSlug: $TSFixMe
}

type UtilWrapperArguments = Pick<
	TutorialsFrontDoorLinkClickedEvent,
	'linkPath' | 'productSlug'
>

/**
 * @see /analytics/spec/events/tutorials_front_door_link_clicked.yaml
 */
const trackTutorialsFrontDoorLinkClicked = ({
	linkCategory: link_category,
	linkPath: link_path,
	productSlug: product_slug,
}: TutorialsFrontDoorLinkClickedEvent) => {
	safeAnalyticsTrack('Tutorials Front Door Link Clicked', {
		link_category,
		link_path,
		product_slug,
	})
}

const trackCertificationCardLinkClicked = ({
	linkPath,
	productSlug,
}: UtilWrapperArguments) => {
	trackTutorialsFrontDoorLinkClicked({
		linkCategory: 'certification-card',
		linkPath,
		productSlug,
	})
}

const trackCollectionCardLinkClicked = ({
	linkPath,
	productSlug,
}: UtilWrapperArguments) => {
	trackTutorialsFrontDoorLinkClicked({
		linkCategory: 'collection-card',
		linkPath,
		productSlug,
	})
}

const trackFeaturedUseCaseLinkClicked = ({
	linkPath,
	productSlug,
}: UtilWrapperArguments) => {
	trackTutorialsFrontDoorLinkClicked({
		linkCategory: 'featured-use-case',
		linkPath,
		productSlug,
	})
}

const trackProductTutorialsLandingLinkClicked = ({
	linkPath,
	productSlug,
}: UtilWrapperArguments) => {
	trackTutorialsFrontDoorLinkClicked({
		linkCategory: 'product-tutorials-landing',
		linkPath,
		productSlug,
	})
}

const trackTutorialLibraryLinkClicked = ({
	linkPath,
	productSlug,
}: UtilWrapperArguments) => {
	trackTutorialsFrontDoorLinkClicked({
		linkCategory: 'tutorial-library',
		linkPath,
		productSlug,
	})
}

export {
	trackCertificationCardLinkClicked,
	trackCollectionCardLinkClicked,
	trackFeaturedUseCaseLinkClicked,
	trackProductTutorialsLandingLinkClicked,
	trackTutorialLibraryLinkClicked,
}
