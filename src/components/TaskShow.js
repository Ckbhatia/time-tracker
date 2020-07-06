import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MdDelete } from "react-icons/md";
import CreateTag from "./CreateTag";

const SimplifyTime = (date) => {
	// TODO: fix this
	return new Date(date).toLocaleTimeString().substring(0, 10);
};

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

const TaskShow = () => {
	const { loading, error, data } = useQuery(GetTasks);
	const [deleteAtask] = useMutation(deleteOneTask);
	const [tagId, updateTagId] = useState(null);

	const submitTaskData = (id) => {
		deleteAtask({
			variables: {
				id,
			},
		});
		// TODO: add refresh function call here
	};

	const updateTitle = (e) => {
		//
	};

	if (error) return `Error! ${error.message}`;

	return (
		<div className="task-list-main-container">
			<div className="task-list-container">
				<ul className="list-container">
					{!loading &&
						data.tasks.map((task) => (
							<li key={task.id} value={task.name}>
								<div className="task-container">
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
