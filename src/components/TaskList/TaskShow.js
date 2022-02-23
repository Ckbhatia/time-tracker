import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MdDelete } from "react-icons/md";
import CreateTag from "../Tag/CreateTag";
import { SimplifyTime, getDurationTime } from "../../utils/dateTime";
import { StyledButtonContainer, StyledDateTime, StyledExtraInfoContainer, StyledHeaderContainer, StyledListContainer, StyledMainContainer, StyledTagContainer, StyledTaskContainer, StyledTaskInputContainer, StyledTaskMainInfoContainer, StyledTimeContainer, StyledTimeDifferenceContainer } from "./Styles";
import { tasksByTime } from "../../utils/task";
import { deleteOneTask, GetTasks, updateOneTaskTag, updateTaskTitle } from "../../service"

const TaskShow = ({ shouldRefetch, udpateShouldRefetch }) => {
	const [editTaskInfo, setEditTaskInfo] = useState();

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

	const [
		updateATaskTitle,
		{ loading: updateTaskMutLoading, error: updateTaskMutError },
	] = useMutation(updateTaskTitle);

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

	const handleChange = (e, taskId) => {
		if (e.target.name && !editTaskInfo) {
			setEditTaskInfo({fieldName: e.target.name, id: taskId, value: e.target.value});
		} else if(e.target.name === editTaskInfo?.fieldName) {
			setEditTaskInfo({...editTaskInfo, value: e.target.value});
		}
	}

	// 	Possible errors
	if (error) return `Error! ${error.message}`;

	if (delMutError) return `Error! couldn't delete the task. Please refresh.`;

	if (updateMutError) return `Error! couldn't update the tag. Please refresh.`;

	const tasks = tasksByTime(data);

	const getTaskInputValue = (task) => {
		if(editTaskInfo) {
			if(editTaskInfo.fieldName === `task-title-${task.id}`) {
				return editTaskInfo.value;
			}
		}
	  return task.title;
	}

	const handleBlur = async () => {
		if(editTaskInfo) {
			await updateATaskTitle({
				variables: {
					id: editTaskInfo.id,
					title: editTaskInfo.value,
				},
			});
	
			setEditTaskInfo(null)
		}
	}

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
											<StyledTaskMainInfoContainer>
												<StyledTaskInputContainer className="task-input-container">
													<input
														type="text"
														name={`task-title-${task.id}`}
														value={getTaskInputValue(task)}
														onBlur={handleBlur}
														onChange={(e) => handleChange(e, task?.id)}
													/>
												</StyledTaskInputContainer>
												<StyledTagContainer>
													<CreateTag
														updateTagId={updateTagId}
														currentTag={task?.tag_id}
														submitTaskTagData={submitTaskTagData}
													/>
												</StyledTagContainer>
											</StyledTaskMainInfoContainer>
											<StyledExtraInfoContainer>
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
											</StyledExtraInfoContainer>
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

