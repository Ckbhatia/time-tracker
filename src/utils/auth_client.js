import ApolloClient from "apollo-boost";

const authClient = new ApolloClient({
  uri: process.env.REACT_APP_BE_AUTH_URI,
});

export default authClient;
