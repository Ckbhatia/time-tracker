import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: 'https://test-323.herokuapp.com/v1/graphql',
  // TODO: Add process env variable
  // Note: Replace the token
  headers: {
    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1xTFFXMDlNTUxRMUNNZGJpV3cwSyJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTExNTI1MTMwNTYwNTI0MDU4NzIwIn0sImdpdmVuX25hbWUiOiJDaGV0YW4iLCJmYW1pbHlfbmFtZSI6Ikt1bWFyIiwibmlja25hbWUiOiJjaGV0YW5zYWluODYiLCJuYW1lIjoiQ2hldGFuIEt1bWFyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpWHpiaUJHd1ExazM1TlFxdWxPSE42cEowMjY5X2s5ZmVkUzlJLSIsImxvY2FsZSI6ImVuLUdCIiwidXBkYXRlZF9hdCI6IjIwMjAtMDctMDVUMTM6NDE6MTAuMjQ1WiIsImlzcyI6Imh0dHBzOi8vdGVzdC0zMjMudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTExNTI1MTMwNTYwNTI0MDU4NzIwIiwiYXVkIjoiTXJVUzNzWUxKVFNaWjMyaVIzeDlIcEFidzM5VlVSVWgiLCJpYXQiOjE1OTM5NTY0NzAsImV4cCI6MTU5Mzk5MjQ3MCwiYXRfaGFzaCI6ImtnMHVvbzZ2WkVpOENiU3J5WklCa2ciLCJub25jZSI6IlRFWVFlMDF6bDRranhSLlUya21YOGEyUEhRbDNJSU90In0.ESvz7y29pazhZ6dMNz622cgb03Fr_3XFTWavL5HxCM5RjYFYXANPZNpH7Y2TS6JvRogzkkG0ZLTDAu_FXrr2JOfBn2O8Nw-8DRpEI3LNyyCmTC25LKpiSRo5PaYEczsil2-mcsSP8LPD7YZyXaIBlgRfd359U7QGx6MgMMR8hde43h3bcDJ8-osNpC0M2ZV2mkrD1GpfskXY3bj1gWXjcFekB4E_A16gNdWK4ZcL0cBmSz5dgL060s_p0sxBoDH3jTTU61l0VCcmiUwBFvZdlTjGPEfDhuIlwqzP7wlct7mIpVMTLwaDg6aXObBt-FwcDtWwhD4oDgD3rrrI9Z-Ziw`
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