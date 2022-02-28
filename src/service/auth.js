import gql from "graphql-tag";

export const login = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      username
      email
    }
  }
`;

export const register = gql`
  mutation($name: String!, $username: String!, $email: String!, $password: String!) {
    signup(email: $email, password: $password, name: $name, username: $username) {
      token
    }
  }
`;