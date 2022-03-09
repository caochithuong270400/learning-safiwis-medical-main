export default (context) => {
  return {
    httpEndpoint:
      process.env.HASURA_ENDPOINT ||
      'https://learn.safiwis.com/v1/graphql',
    httpLinkOptions: {
      headers: {
        'x-hasura-admin-secret': 'Admin@learnsecret123',
      },
    },

    /*
     * For permanent authentication provide `getAuth` function.
     * The string returned will be used in all requests as authorization header
     */
    // getAuth: () => 'Bearer my-static-token',
  }
}
