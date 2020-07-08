import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MdDelete } from "react-icons/md";
import CreateTag from "./CreateTag";

/* Simplifies the date to AM/PM time only
 *	param {object}
 *	return {string}
 */
const SimplifyTime = (date) => {
	if (date) {
		let time = date.substring(11, 19);
		let H = +time.substr(0, 2);
		let h = H % 12 || 12;
		let ampm = H < 12 || H === 24 ? "AM" : "PM";
		time = h + time.substr(2, 3) + " " + ampm;
		return time;
	}
};

// Graphql queries
const GetTasks = gql`
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
	}
`;

const deleteOneTask = gql`
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

const updateOneTaskTag = gql`
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

const TaskShow = ({ shouldRefetch, udpateShouldRefetch }) => {
	const { loading, error, data, refetch, networkStatus } = useQuery(GetTasks, {
		notifyOnNetworkStatusChange: true,
	});

	const [
		deleteAtask,
		{ loading: delMutLoading, error: delMutError },
	] = useMutation(deleteOneTask);

	const [
		updateATaskTag,
		{ loading: updateMutLoading, error: updateMutError },
	] = useMutation(updateOneTaskTag);

	const [tagId, updateTagId] = useState(null);
	const [currentTaskId, updateCurrentTaskId] = useState(null);

	useEffect(() => {
		// Check if refetch is requested
		if (shouldRefetch) {
			(async () => {
				await refetch();
				udpateShouldRefetch(false);
			})();
		}
	}, [shouldRefetch]);

	const submitTaskData = async (id) => {
		await deleteAtask({
			variables: {
				id,
			},
		});
		// Fetch data again after delete action done
		if (!delMutLoading) {
			refetch();
		}
	};

	const submitTaskTagData = (tagId) => {
		if (tagId !== null) {
			updateATaskTag({
				variables: {
					task_id: currentTaskId,
					tag_id: tagId,
				},
			});
		}
	};

	const updateTitle = (e) => {
		// TODO: add update title functionality
	};

	// 	Possible errors
	if (error) return `Error! ${error.message}`;

	if (delMutError) return `Error! couldn't delete the task. Please refresh.`;

	if (updateMutError) return `Error! couldn't update the tag. Please refresh.`;

	return (
		<div className="task-list-main-container">
			<div className="task-list-container">
				<ul className="list-container">
					{!loading &&
						data.tasks.map((task) => (
							<li key={task.id} value={task.name} data-id={task.id}>
								<div
									className="task-container"
									onClick={(e) => {
										updateCurrentTaskId(
											Number(e.currentTarget.parentNode.dataset.id)
										);
									}}
								>
									<div className="task-input-container">
										<input
											className="task-input"
											type="text"
											name="task-title"
											value={task.title}
											onChange={(e) => (task.title += e.target.value)}
										/>
									</div>
									<div className="tag-container">
										{/*TODO: Pass tag data to createTag component*/}
										<CreateTag
											updateTagId={updateTagId}
											currentTag={task.tags[0]}
											submitTaskTagData={submitTaskTagData}
										/>
									</div>
									<div className="task-timer-container">
										{/*TODO: Simplify the date to only time, four digit*/}
										<span className="start-time">
											{SimplifyTime(task.start_time)}
										</span>
										<span className="end-time">
											{SimplifyTime(task.end_time)}
										</span>
									</div>
									<div className="delete-btn-container">
										<button
											className="delete-btn"
											onClick={() => submitTaskData(task.id)}
										>
											<MdDelete />
										</button>
									</div>
								</div>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};
export default TaskShow;
