import { ApolloClient, InMemoryCache } from "@apollo/client";

const authClient = new ApolloClient({
  uri: process.env.REACT_APP_BE_AUTH_URI,
  cache: new InMemoryCache()
});

export default authClient;
