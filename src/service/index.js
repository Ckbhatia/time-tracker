import gql from "graphql-tag";


// Graphql queries
export const GetTasks = gql`
query ($limit: Int!,  $offset: Int!) {
	tasks_aggregate{
		aggregate {
			totalCount: count(columns: title)
		}
	}
	tasks(limit: $limit, offset: $offset, order_by: {start_time: desc}) {
		title
		id
		created_at
		start_time
		end_time
		tag_id
	}
}`;

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

export const updateOneTaskTag = gql`
mutation($task_id: Int!, $tag_id: Int!) {
	update_tasks_by_pk(pk_columns: {id: $task_id}, _set: {tag_id: $tag_id}) {
    id
    tag_id
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

// Tag 
export const createOneTag = gql`
  mutation($title: String!) {
    insert_tags_one(object: { title: $title }) {
      id
      title
    }
  }
`;