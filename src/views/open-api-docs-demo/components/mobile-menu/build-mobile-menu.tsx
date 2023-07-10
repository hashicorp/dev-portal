import {
	SidebarHorizontalRule,
	SidebarNavMenuItem,
} from 'components/sidebar/components'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { generateProductLandingSidebarMenuItems } from 'components/sidebar/helpers/generate-product-landing-nav-items'
import { generateResourcesNavItems } from 'components/sidebar/helpers'
import hcpProductData from 'data/hcp.json'
import s from './build-mobile-menu.module.css'

export function buildMobileMenu() {
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
			heading: 'HCP Vault Secrets API',
			content: (
				<ul className={s.listResetStyles}>
					<h3 className={s.heading}>HCP Vault Secrets API</h3>
					<div style={{ border: '1px solid magenta' }}>
						TODO: mobile nav contents will go here
					</div>
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
	]
}
