import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from '@apollo/client';
import { getAuthToken } from "./storage";

const httpLink = new HttpLink({ uri: process.env.REACT_APP_BE_URI });

const authLink = new ApolloLink(async (operation, forward) => {

  const token = await getAuthToken();

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;