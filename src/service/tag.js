import { gql } from "@apollo/client";

export const GetTags = gql`
  query($author_id: Int!) {
    time_tracker_tags(
      where: { author_id: { _eq: $author_id } }
      order_by: { created_at: desc }
    ) {
      id
      title
    }
  }
`;

export const createOneTag = gql`
  mutation($title: String!, $author_id: Int!) {
    insert_time_tracker_tags_one(
      object: { title: $title, author_id: $author_id }
    ) {
      id
      title
    }
  }
`;

export const updateOneTaskTag = gql`
  mutation($task_id: Int!, $tag_id: Int!) {
    update_time_tracker_tasks_by_pk(
      pk_columns: { id: $task_id }
      _set: { tag_id: $tag_id }
    ) {
      id
      tag_id
    }
  }
`;

export const deleteOneTaskTag = gql`
  mutation($tag_id: Int!) {
    delete_time_tracker_tags_by_pk(id: $tag_id) {
      id
    }
  }
`;
