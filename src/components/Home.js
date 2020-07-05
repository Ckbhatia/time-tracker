import React, {useState} from "react";
import CreateTask from "./CreateTask";
import TaskShow from "./TaskShow";

const Home = (props) => {
  return (
    <main className="main-home">
      <div className="main-container">
        <CreateTask />
        <TaskShow />
      </div>
    </main>
  )
};

export default Home;