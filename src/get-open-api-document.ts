import { SecurityRequirementObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { generateOpenApi } from '@ts-rest/open-api'
import { contract } from './contract'

export const getOpenApiDocument = () =>
  generateOpenApi(
    contract,
    {
      info: {
        title: 'My API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    },
    {
      setOperationId: true,
      operationMapper: (operation, appRoute) => ({
        ...operation,
        ...(hasCustomTags(appRoute.metadata)
          ? {
              tags: appRoute.metadata.openApiTags,
            }
          : {}),
        ...(hasSecurity(appRoute.metadata)
          ? {
              security: appRoute.metadata.openApiSecurity,
            }
          : {}),
      }),
    },
  )

const hasCustomTags = (
  metadata: unknown,
): metadata is { openApiTags: string[] } => {
  return !!metadata && typeof metadata === 'object' && 'openApiTags' in metadata
}

const hasSecurity = (
  metadata: unknown,
): metadata is { openApiSecurity: SecurityRequirementObject[] } => {
  return (
    !!metadata && typeof metadata === 'object' && 'openApiSecurity' in metadata
  )
}
