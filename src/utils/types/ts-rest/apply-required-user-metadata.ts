import { AppRoute } from '@ts-rest/core'

export function applyRequiredUserMetadata<R extends AppRoute>(route: R): R {
  const r: R = {
    ...route,
    metadata: {
      ...(route.metadata || {}),
      openApiSecurity: [
        {
          bearerAuth: [],
        },
      ],
    },
  }

  return r
}
