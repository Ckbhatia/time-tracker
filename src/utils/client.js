import ApolloClient from "apollo-boost";
import { getAuthToken } from "./storage";

const client = new ApolloClient({
  uri: process.env.REACT_APP_BE_URI,
  request: async (operation) => {
    const token = await getAuthToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
});

export default client;