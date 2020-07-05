import React, {useState} from "react";
import CreateTask from "./CreateTask";

const Home = (props) => {
  return (
    <main className="main-home">
      <div className="main-container">
        <CreateTask />
      </div>
    </main>
  )
};

export default Home;