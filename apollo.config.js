export default (_) => {
  return {
    httpEndpoint: process.env.GRAPHQL || 'http://localhost:3000/graphql',
    wsEndpoint:
      process.env.SUBSCRIPTIONS || 'ws://localhost:3000/subscriptions',
    httpLinkOptions: {
      credentials: 'include',
    },
  }
}
