/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import LandingHero from '@components/landing-hero'


function CertificationsRegistrationView({jsonContent, mdxItems}) {
    return (
        <BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
            {/* Hero */}
            <LandingHero heading={jsonContent.page_title} noImage={true} />
            {/* Info cards */}
            {/* Footer */}
        </BaseLayout>
    )

}

export default CertificationsRegistrationView