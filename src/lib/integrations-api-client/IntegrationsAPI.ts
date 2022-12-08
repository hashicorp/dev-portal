/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest'
import type { OpenAPIConfig } from './core/OpenAPI'
import { NodeHttpRequest } from './core/NodeHttpRequest'

import { ComponentsService } from './services/ComponentsService'
import { FlagsService } from './services/FlagsService'
import { HealthCheckService } from './services/HealthCheckService'
import { IntegrationFlagsService } from './services/IntegrationFlagsService'
import { IntegrationReleaseComponentsService } from './services/IntegrationReleaseComponentsService'
import { IntegrationReleasesService } from './services/IntegrationReleasesService'
import { IntegrationsService } from './services/IntegrationsService'
import { NotifyReleaseService } from './services/NotifyReleaseService'
import { OrganizationsService } from './services/OrganizationsService'
import { ProductsService } from './services/ProductsService'
import { VariableGroupConfigsService } from './services/VariableGroupConfigsService'
import { VariableGroupsService } from './services/VariableGroupsService'
import { VariablesService } from './services/VariablesService'

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest

export class IntegrationsAPI {
	public readonly components: ComponentsService
	public readonly flags: FlagsService
	public readonly healthCheck: HealthCheckService
	public readonly integrationFlags: IntegrationFlagsService
	public readonly integrationReleaseComponents: IntegrationReleaseComponentsService
	public readonly integrationReleases: IntegrationReleasesService
	public readonly integrations: IntegrationsService
	public readonly notifyRelease: NotifyReleaseService
	public readonly organizations: OrganizationsService
	public readonly products: ProductsService
	public readonly variableGroupConfigs: VariableGroupConfigsService
	public readonly variableGroups: VariableGroupsService
	public readonly variables: VariablesService

	public readonly request: BaseHttpRequest

	constructor(
		config?: Partial<OpenAPIConfig>,
		HttpRequest: HttpRequestConstructor = NodeHttpRequest
	) {
		this.request = new HttpRequest({
			BASE: config?.BASE ?? 'http://localhost:5000',
			VERSION: config?.VERSION ?? '1.0.0',
			WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
			CREDENTIALS: config?.CREDENTIALS ?? 'include',
			TOKEN: config?.TOKEN,
			USERNAME: config?.USERNAME,
			PASSWORD: config?.PASSWORD,
			HEADERS: config?.HEADERS,
			ENCODE_PATH: config?.ENCODE_PATH,
		})

		this.components = new ComponentsService(this.request)
		this.flags = new FlagsService(this.request)
		this.healthCheck = new HealthCheckService(this.request)
		this.integrationFlags = new IntegrationFlagsService(this.request)
		this.integrationReleaseComponents = new IntegrationReleaseComponentsService(
			this.request
		)
		this.integrationReleases = new IntegrationReleasesService(this.request)
		this.integrations = new IntegrationsService(this.request)
		this.notifyRelease = new NotifyReleaseService(this.request)
		this.organizations = new OrganizationsService(this.request)
		this.products = new ProductsService(this.request)
		this.variableGroupConfigs = new VariableGroupConfigsService(this.request)
		this.variableGroups = new VariableGroupsService(this.request)
		this.variables = new VariablesService(this.request)
	}
}
