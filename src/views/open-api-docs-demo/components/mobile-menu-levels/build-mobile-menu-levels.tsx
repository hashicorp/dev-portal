import { ReactNode } from 'react'
import {
	SidebarHorizontalRule,
	SidebarNavMenuItem,
} from 'components/sidebar/components'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { generateProductLandingSidebarMenuItems } from 'components/sidebar/helpers/generate-product-landing-nav-items'
import { generateResourcesNavItems } from 'components/sidebar/helpers'
import hcpProductData from 'data/hcp.json'
import s from './mobile-menu-levels.module.css'

/**
 * TODO: this is a total stopgap, just trying to get
 * something workable for mobile menu prototyping.
 *
 * Intent is to solidify this into an alternative pattern
 * for composing mobile menu contents later.
 */
export function buildMobileMenuLevels({
	heading,
	content,
}: {
	heading: string
	content: ReactNode
}) {
	return [
		{
			heading: 'Main Menu',
			content: (
				<>
					<h3 className={s.heading}>Main Menu</h3>
					<ul className={s.listResetStyles}>
						{generateTopLevelSubNavItems().map(
							(item: $TSFixMe, index: number) => (
								// eslint-disable-next-line react/no-array-index-key
								<SidebarNavMenuItem item={item} key={index} />
							)
						)}
					</ul>
				</>
			),
		},
		{
			heading: 'HashiCorp Cloud Platform Home',
			content: (
				<ul className={s.listResetStyles}>
					{[
						{
							title: 'HashiCorp Cloud Platform',
							fullPath: `/${hcpProductData.slug}`,
							theme: hcpProductData.slug,
						},
						...generateProductLandingSidebarMenuItems(
							hcpProductData as $TSFixMe
						),
					].map((item: $TSFixMe, index: number) => (
						// eslint-disable-next-line react/no-array-index-key
						<SidebarNavMenuItem item={item} key={index} />
					))}
					<SidebarHorizontalRule />
					<ul className={s.listResetStyles}>
						{generateResourcesNavItems(hcpProductData.slug as $TSFixMe).map(
							(item, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<SidebarNavMenuItem item={item} key={index} />
							)
						)}
					</ul>
				</ul>
			),
		},
		{
			heading,
			content: (
				<div>
					{/* Provided content for this level */}
					{content}
					{/* Common resources for this product */}
					<SidebarHorizontalRule />
					<ul className={s.listResetStyles}>
						{generateResourcesNavItems(hcpProductData.slug as $TSFixMe).map(
							(item, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<SidebarNavMenuItem item={item} key={index} />
							)
						)}
					</ul>
				</div>
			),
		},
	]
}
