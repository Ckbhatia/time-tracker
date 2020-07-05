import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: 'https://test-323.herokuapp.com/v1/graphql',
  headers: {
    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1xTFFXMDlNTUxRMUNNZGJpV3cwSyJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTExNTI1MTMwNTYwNTI0MDU4NzIwIn0sImdpdmVuX25hbWUiOiJDaGV0YW4iLCJmYW1pbHlfbmFtZSI6Ikt1bWFyIiwibmlja25hbWUiOiJjaGV0YW5zYWluODYiLCJuYW1lIjoiQ2hldGFuIEt1bWFyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpWHpiaUJHd1ExazM1TlFxdWxPSE42cEowMjY5X2s5ZmVkUzlJLSIsImxvY2FsZSI6ImVuLUdCIiwidXBkYXRlZF9hdCI6IjIwMjAtMDctMDVUMDM6Mzg6MzMuNTIzWiIsImlzcyI6Imh0dHBzOi8vdGVzdC0zMjMudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTExNTI1MTMwNTYwNTI0MDU4NzIwIiwiYXVkIjoiTXJVUzNzWUxKVFNaWjMyaVIzeDlIcEFidzM5VlVSVWgiLCJpYXQiOjE1OTM5MjAzMTMsImV4cCI6MTU5Mzk1NjMxMywiYXRfaGFzaCI6Ild2Tld4ZG1FWjZfNHV4ckxDd2thamciLCJub25jZSI6IjQ5Zzg3QVoxZ3VveUFBaUZrWWczLUlrWk5PZ1Nydkt1In0.jbO8yk-IjXVHxF0eydYFfHogLLUDCooVL3VdeqNDAvgV37KLzTPOHFqpZZ4HTx8G2KAQgn9VBaC8053-XFLEAG1zelRf-PmGQ0z0lu4Zlu3GT_IgN6lCAuh1QWaDvUH5n3KdzRIR2D1kJgM9bc8_l5Eo-0OZDYzdA-wrKdSazq6QzEogzVQhBD1tiOd3ekoQGMVvP1W4ptEQPZ8IOFzWRCwd_D3pQcUwZDM0iMmXbNb1G3Udxn6DDkpMe1BhakHhSfTzUQb9DnZsvj4uBNYeCcIjYmS3yBDUe-hHQ2qu-8tmz_7JwqefpULP1AQ-hkqU-iWSTClhVUXnCyK_EUg7Qg`
  }
});

// TODO: remove this testing code
client
  .query({
    query: gql`
      query {
        tasks(limit: 10) {
        title
        id
        created_at
        start_time
        end_time
        tags {
          name
          id
        }
      }
    }`
  })
  .then(result => console.log(result));

  export default client;