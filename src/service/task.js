import gql from "graphql-tag";

export const GetTasks = gql`
	query ($limit: Int!, $offset: Int!, $author_id: Int!) {
		tasks_aggregate(where: {author_id: {_eq: $author_id}}) {
			aggregate {
				count: count(columns: id)
			}
		}
		tasks(where: {author_id: {_eq: $author_id}}, limit: $limit, offset: $offset, order_by: {start_time: desc}) {
			title
			id
			created_at
			start_time
			end_time
			tag_id
			author_id
		}
	}
`;

export const createOneTask = gql`
  mutation(
    $title: String!
    $start_time: timestamptz!
    $end_time: timestamptz
    $tag_id: Int
    $author_id: Int!
  ) {
    insert_tasks_one(
      object: {
        title: $title
        start_time: $start_time
        end_time: $end_time
        tag_id: $tag_id
        author_id: $author_id
      }
      ) {
        title
        id
        created_at
        start_time
        end_time
        tag_id
        author_id
      }
    }
`;

export const updateTaskTitle = gql`
  mutation ($id: Int!, $title: String) {
    update_tasks_by_pk(pk_columns: {id: $id}, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const deleteOneTask = gql`
	mutation($id: Int!) {
		delete_tasks(where: { id: { _eq: $id } }) {
			returning {
				id
				title
			}
			affected_rows
		}
	}
`;
