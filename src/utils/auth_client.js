import ApolloClient from "apollo-boost";

const authClient = new ApolloClient({
  uri: process.env.REACT_APP_BE_AUTH_URI,
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
  },
});

export default authClient;
