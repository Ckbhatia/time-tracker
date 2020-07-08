import React, { useState } from "react";
import CreateTask from "./CreateTask";
import TaskShow from "./TaskShow";

const Home = (props) => {
	const [shouldRefetch, udpateShouldRefetch] = useState(false);

	return (
		<main className="main-home">
			<div className="main-container">
				<CreateTask udpateShouldRefetch={udpateShouldRefetch} />
				<TaskShow
					shouldRefetch={shouldRefetch}
					udpateShouldRefetch={udpateShouldRefetch}
				/>
			</div>
		</main>
	);
};

export default Home;
