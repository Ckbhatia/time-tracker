import { gql } from '@apollo/client';

export const GetTasks = gql`
	query ($limit: Int!, $offset: Int!, $author_id: Int!) {
		time_tracker_tasks_aggregate(where: {author_id: {_eq: $author_id}, end_time: {_is_null: false}}) {
			aggregate {
				count: count(columns: id)
			}
		}
		time_tracker_tasks(where: {author_id: {_eq: $author_id}, end_time: {_is_null: false}}, limit: $limit, offset: $offset, order_by: {start_time: desc}) {
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

export const GetActiveDraftTask = gql`
	query ($author_id: Int!) {
		time_tracker_tasks(
			where: {author_id: {_eq: $author_id}, end_time: {_is_null: true}}
			limit: 1
			order_by: {start_time: desc}
		) {
			id
			start_time
			title
			tag_id
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
    insert_time_tracker_tasks_one(
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
    update_time_tracker_tasks_by_pk(pk_columns: {id: $id}, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const updateDraftTaskProgress = gql`
  mutation ($id: Int!, $title: String!, $tag_id: Int) {
    update_time_tracker_tasks_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, tag_id: $tag_id }
    ) {
      id
      title
      tag_id
    }
  }
`;

export const deleteOneTask = gql`
	mutation($id: Int!) {
		delete_time_tracker_tasks(where: { id: { _eq: $id } }) {
			returning {
				id
				title
			}
			affected_rows
		}
	}
`;

export const updateDraftTask = gql`
	mutation ($id: Int!, $end_time: timestamptz!, $title: String!, $tag_id: Int) {
		update_time_tracker_tasks_by_pk(
			pk_columns: {id: $id}
			_set: {end_time: $end_time, title: $title, tag_id: $tag_id}
		) {
			id
			end_time
			title
			tag_id
		}
	}
`;
