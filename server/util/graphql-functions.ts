import { getUserByAuthorizationHeader } from './auth-util'

async function onConnect(params: Object) {
  if (!params) return
  // @ts-ignore
  if (params.headers && params.headers.Authorization) {
    const user = await getUserByAuthorizationHeader(
      // @ts-ignore
      params.headers.Authorization
    )

    return {
      req: {
        authUser: user,
      },
    }
  }
}

export { onConnect }
