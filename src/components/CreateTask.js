import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import CreateTag from "./CreateTag";
import { AiFillPlayCircle, AiTwotoneStop } from "react-icons/ai";

const createOneTask = gql`
  mutation(
    $title: String!
    $start_time: timestamptz!
    $end_time: timestamptz
    $tag_id: Int!
  ) {
    insert_tasks_one(
      object: {
        title: $title
        start_time: $start_time
        end_time: $end_time
        task_tags: { data: { tag_id: $tag_id } }
      }
    ) {
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

const getCurrentTime = () => {
  return new Date().toLocaleString();
};

const CreateTask = ({ udpateShouldRefetch }) => {
  const [title, updateTitle] = useState("");
  const [isTimerToggleStart, changeTimerToggle] = useState(false);
  const [timer, updateTimer] = useState("0:00:00");
  const [timerId, updateTimerId] = useState(null);
  const [startTime, updateStartTime] = useState(getCurrentTime());
  const [tagId, updateTagId] = useState(null);

  // GraphQl
  const [
    createAtask,
    { data, loading: createTaskLoading, error: createTaskError },
  ] = useMutation(createOneTask);

  const submitTaskData = async (startTime, endTime) => {
    if (!tagId) {
      // TODO: Style this { low priority }
      alert("Please select a tag");
    } else if (!title) {
      // TODO: Style this { low priority }
      alert("Please type title");
    } else {
      await createAtask({
        variables: {
          title,
          start_time: startTime,
          end_time: endTime,
          tag_id: tagId,
        },
      });
      // Check if loading is over and there's no error
      if (!createTaskLoading && !createTaskError) {
        udpateShouldRefetch(true);
      }
      // Reset
      updateTitle("");
    }
  };

  const startTimer = () => {
    // Toggle timer flag to true
    changeTimerToggle(true);

    // updateStartTime
    updateStartTime(getCurrentTime());

    let sec = 0;
    let min = 0;
    let hr = 0;

    const intervalId = setInterval(() => {
      updateTimer(
        `${hr}:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`
      );
      sec++;
      if (sec > 59) {
        min++;
        sec -= 59;
        if (min > 59) {
          // Reset minutes and inc hour
          hr++;
          min -= 59;
        }
      }
    }, 1000);

    // Update timer
    updateTimerId(intervalId);
  };

  const stopTimer = async () => {
    // Toggle timer flag to false
    changeTimerToggle(false);

    const endTime = getCurrentTime();
    submitTaskData(startTime, endTime);

    // Reset timer
    updateTimer("0:00:00");

    clearInterval(timerId);
  };

  return (
    <main className="main-create-task">
      <div className="main-container">
        <div className="task-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isTimerToggleStart) {
                startTimer();
              }
            }}
          >
            <input
              type="text"
              className="text"
              name="title"
              placeholder="type task title"
              value={title}
              onChange={(e) => updateTitle(e.target.value)}
            />
          </form>
          <CreateTag updateTagId={updateTagId} />
          <button
            className="timer-button"
            onClick={() => (isTimerToggleStart ? stopTimer() : startTimer())}
          >
            {isTimerToggleStart ? <AiTwotoneStop /> : <AiFillPlayCircle />}
          </button>
          <div className="timer-container">
            <span className="timer">{timer}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateTask;
