import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';

/**
 * This will create an instance of an Apollo client using the provided options.
 * @param options
 */
export function createApolloClient(options) {
  const link = new HttpLink({
    uri: options.endpoint,
    credentials: "same-origin"
  });
  const link2 = new HttpLink({
    uri: options.endpoint2,
    credentials: "same-origin"
  });
  
  return new ApolloClient({
    link: ApolloLink.split(
        (operation) => {
          return operation.getContext().clientName ===
              "tradeitemtransformationmanagementservice";
        },
        // the string "third-party" can be anything you want,
        // we will use it in a bit
        link, // <= apollo will send to this if clientName is "third-party"
        link2 // <= otherwise will send to this
    ),
    credentials: "include",
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(options, initialState) {
  let apolloClient;

  // Create new client for each request
  if (!apolloClient) {
    apolloClient = createApolloClient(options);
  }

  // If your page has data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    apolloClient.cache.restore(initialState);
  }

  return apolloClient;
}
