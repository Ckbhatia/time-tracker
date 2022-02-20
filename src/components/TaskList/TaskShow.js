import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MdDelete } from "react-icons/md";
import CreateTag from "../Tag/CreateTag";
import { SimplifyTime, getDurationTime } from "../../utils/dateTime";
import { StyledButtonContainer, StyledDateTime, StyledHeaderContainer, StyledListContainer, StyledMainContainer, StyledTagContainer, StyledTaskContainer, StyledTaskInputContainer, StyledTimeContainer, StyledTimeDifferenceContainer } from "./Styles";
import { tasksByTime } from "../../utils/task";

// Graphql queries
const GetTasks = gql`
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

	const tasks = tasksByTime(data);

	return (
		<StyledMainContainer >
			<div className="task-list-container">
				{!loading && data?.tasks?.length ?
					Object.keys(tasks)?.map((date) => {
						return (
						<StyledListContainer key={date}>
							<StyledHeaderContainer>
								<StyledDateTime>
								{date}
								</StyledDateTime>
							</StyledHeaderContainer>
							{tasks[date].map((task) => {
								const { hours, minutes, seconds } = getDurationTime(task.start_time, task.end_time);
								return (
									<li key={task.id} value={task.name} data-id={task.id}>
										<StyledTaskContainer
											onClick={(e) => {
												updateCurrentTaskId(
													Number(e.currentTarget.parentNode.dataset.id)
												);
											}}
										>
											<StyledTaskInputContainer className="task-input-container">
												<input
													type="text"
													name="task-title"
													value={task.title}
													onChange={(e) => (task.title += e.target.value)}
												/>
											</StyledTaskInputContainer>
											<StyledTagContainer>
												<CreateTag
													updateTagId={updateTagId}
													currentTag={task?.tag_id}
													submitTaskTagData={submitTaskTagData}
												/>
											</StyledTagContainer>
											<StyledTimeContainer className="task-timer-container">
												<span className="start-time">
													{SimplifyTime(task.start_time)}
												</span>
												<span className="end-time">
													{SimplifyTime(task.end_time)}
												</span>
											</StyledTimeContainer>
											<StyledTimeDifferenceContainer>
												{hours}:{minutes}:{seconds}
											</StyledTimeDifferenceContainer>
											<StyledButtonContainer>
												<button
													onClick={() => submitTaskData(task.id)}
												>
													<MdDelete />
												</button>
											</StyledButtonContainer>
										</StyledTaskContainer>
									</li>
										)
									}
								)
							}
						</StyledListContainer>
						)})
					: null
			}		
			</div>
		</StyledMainContainer>
	);
};
export default TaskShow;


