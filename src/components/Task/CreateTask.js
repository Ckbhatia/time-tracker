import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Tag from "../Tag/Tag";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsFillStopCircleFill } from "react-icons/bs";
import { getCurrentTime } from "../../utils/dateTime";
import {
  StyledCreateTaskInput,
  StyledMainTaskContainer,
  StyledTaskContainer,
} from "./Styles";
import { createOneTask } from "../../service";
import { AuthContext } from "../../Context/AuthContext";
import tost from "../../utils/toast";
import { ERROR_MESSAGE, ERROR_TEXT, INFO_TEXT, SUCCESS_TEXT } from "../../constants";

const CreateTask = ({ udpateShouldRefetch }) => {
  const [title, setTitle] = useState("");
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [timerId, setTimerId] = useState(null);
  const [startTime, setStartTime] = useState(() => getCurrentTime());
  const [tagId, setTagId] = useState(null);

  const { userInfo } = React.useContext(AuthContext);

  // GraphQl
  const [
    createAtask,
    { data, loading: createTaskLoading, error: createTaskError, reset },
  ] = useMutation(createOneTask);

  if(data && !createTaskLoading) {
    tost(SUCCESS_TEXT, "Task saved successfully");
    reset();
  }

  if(!data && createTaskLoading) {
    tost(INFO_TEXT, "Saving task...");
    reset();
  }

  if (createTaskError) {
    tost(ERROR_TEXT, ERROR_MESSAGE);
    reset();
  }

  const submitTaskData = async (startTime, endTime) => {
    if (!tagId) {
      tost(ERROR_TEXT, "Please select a tag");
      return;
    } else if (!title) {
      tost(ERROR_TEXT, "Please type a title");
      return;
    } else {
      await createAtask({
        variables: {
          title,
          start_time: startTime,
          end_time: endTime,
          tag_id: tagId,
          author_id: userInfo?.userId,
        },
      });
      // Check if loading is over and there's no error
      if (!createTaskLoading && !createTaskError) {
        udpateShouldRefetch(true);
      }
      // Reset
      setTitle("");
    }
  };

  const startTimer = () => {
    // Toggle timer flag to true
    setTimerRunning(true);

    // updateStartTime
    setStartTime(getCurrentTime());

    let sec = 0;
    let min = 0;
    let hr = 0;

    const intervalId = setInterval(() => {
      setTimer(
        `${hr < 10 ? "0" + hr : hr}:${min < 10 ? "0" + min : min}:${
          sec < 10 ? "0" + sec : sec
        }`
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
    setTimerId(intervalId);
  };

  const stopTimer = async () => {
    // Toggle timer flag to false
    setTimerRunning(false);

    const endTime = getCurrentTime();
    submitTaskData(startTime, endTime);

    // Reset timer
    setTimer("00:00:00");

    clearInterval(timerId);
  };

  const handleClick = () => {
    isTimerRunning ? stopTimer() : startTimer();
  };

  return (
    <main className="main-create-task">
      <StyledMainTaskContainer>
        <StyledTaskContainer>
          <div className="task-form-container">
            <form
              className="task-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleClick();
              }}
            >
              <StyledCreateTaskInput
                type="text"
                className="task_input"
                name="title"
                placeholder="What are you working on?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </form>
          </div>

          <div className="task-action-container">
            <Tag updateTagId={setTagId} />
            <button className="timer-button" onClick={handleClick}>
              <span>
                {isTimerRunning ? (
                  <BsFillStopCircleFill />
                ) : (
                  <AiFillPlayCircle />
                )}
              </span>
            </button>
            <div className="timer-container">
              <span className="timer">{timer}</span>
            </div>
          </div>
        </StyledTaskContainer>
      </StyledMainTaskContainer>
    </main>
  );
};

export default CreateTask;
