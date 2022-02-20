import gql from "graphql-tag";


// Graphql queries
export const GetTasks = gql`
	query {
		tasks(limit: 10, order_by: { start_time: desc }) {
			title
			id
			created_at
			start_time
			end_time
			tag_id
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

export const updateOneTaskTag = gql`
	mutation($task_id: Int!, $tag_id: Int!) {
		update_task_tag(
			where: { task_id: { _eq: $task_id } }
			_set: { tag_id: $tag_id }
		) {
			returning {
				task_id
				task {
					title
				}
				tag {
					name
				}
			}
			affected_rows
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