# Backend Context Engineering Prompt: Draft Task Timer

Use this prompt in the backend repository to implement API support for the frontend draft timer flow.

## Objective
Implement a draft-task lifecycle where:
- Timer start creates a draft task immediately (start persisted server-side).
- Timer stop completes that draft (sets end_time/title/tag).
- On refresh, frontend can fetch one active draft and resume elapsed time.

## Product Behavior
- At most one active draft per user (`end_time IS NULL`).
- Starting timer in frontend creates a task with placeholder title `"Draft"`, null `end_time`, null `tag_id`.
- Stopping timer updates that same row with `end_time`, final `title`, and `tag_id`.
- Completed task list should exclude drafts (`end_time IS NOT NULL`).

## Existing Frontend Contract
Frontend now expects:
- Query: `GetActiveDraftTask($author_id: Int!)`
- Mutation: `updateDraftTask($id: Int!, $end_time: timestamptz!, $title: String!, $tag_id: Int)`
- Existing create mutation still used for draft creation.

Expected shapes:

```graphql
query GetActiveDraftTask($author_id: Int!) {
  time_tracker_tasks(
    where: { author_id: { _eq: $author_id }, end_time: { _is_null: true } }
    limit: 1
    order_by: { start_time: desc }
  ) {
    id
    start_time
    title
    tag_id
  }
}
```

```graphql
mutation updateDraftTask($id: Int!, $end_time: timestamptz!, $title: String!, $tag_id: Int) {
  update_time_tracker_tasks_by_pk(
    pk_columns: { id: $id }
    _set: { end_time: $end_time, title: $title, tag_id: $tag_id }
  ) {
    id
    end_time
    title
    tag_id
  }
}
```

## Required Backend Changes
1. Ensure `time_tracker_tasks.end_time` is nullable.
2. Ensure update by primary key supports `_set` for `end_time`, `title`, `tag_id`.
3. Enforce one-active-draft-per-user invariant. Pick one strategy:
   - Preferred: DB-level partial unique index on `(author_id)` where `end_time IS NULL`.
   - Alternative: transactional service guard that rejects creating a second active draft.
4. Verify permissions:
   - Users can only read/update/delete their own tasks.
   - Draft query must be scoped by authenticated user.
5. Keep completed-task APIs filterable by `end_time IS NOT NULL` for list screens.

## Non-Functional Expectations
- Concurrency-safe behavior when two tabs try to start timer.
- Clear error returned for duplicate active draft creation.
- No timezone conversion on server persistence; store UTC timestamps as-is.

## Suggested Implementation Checklist
1. Add/verify DB constraint for one active draft per user.
2. Add or verify GraphQL operation exposure (`GetActiveDraftTask`, `updateDraftTask`).
3. Add/adjust auth policies for row-level ownership.
4. Add tests:
   - Create draft succeeds when no draft exists.
   - Second draft creation fails for same user.
   - Completing draft sets `end_time`, `title`, `tag_id`.
   - Active draft query returns latest active draft only.
5. Document API behavior and duplicate-draft error contract.

## Acceptance Criteria
- User can start timer, refresh, and continue with preserved elapsed tracking.
- User can stop timer and saved record appears in completed task list.
- No orphan duplicate active drafts per user.
- Task list endpoints can exclude drafts by default or via filter.
