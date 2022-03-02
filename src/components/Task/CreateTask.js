import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import CreateTag from "../Tag/CreateTag";
import { AiFillPlayCircle, AiTwotoneStop } from "react-icons/ai";
import { getCurrentTime } from "../../utils/dateTime";
import { StyledCreateTaskInput, StyledMainTaskContainer, StyledTaskContainer } from "./Styles";
import { createOneTask } from "../../service";
import { AuthContext } from "../../Context/AuthContext";

const CreateTask = ({ udpateShouldRefetch }) => {
  const [title, setTitle] = useState("");
  const [isTimerToggleStart, setTimerToggle] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [timerId, setTimerId] = useState(null);
  const [startTime, setStartTime] = useState(() => getCurrentTime());
  const [tagId, setTagId] = useState(null);

  const { userInfo } = React.useContext(AuthContext);

  // GraphQl
  const [
    createAtask,
    { loading: createTaskLoading, error: createTaskError },
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
    setTimerToggle(true);

    // updateStartTime
    setStartTime(getCurrentTime());

    let sec = 0;
    let min = 0;
    let hr = 0;

    const intervalId = setInterval(() => {
      setTimer(
        `${hr < 10 ? "0" + hr : hr}:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`
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
    setTimerToggle(false);

    const endTime = getCurrentTime();
    submitTaskData(startTime, endTime);

    // Reset timer
    setTimer("00:00:00");

    clearInterval(timerId);
  };

  const handleClick = () => {
    isTimerToggleStart ? stopTimer() : startTimer()
  }

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
            <CreateTag updateTagId={setTagId} />
            <button
              className="timer-button"
              onClick={handleClick}
              >
              {isTimerToggleStart ? <AiTwotoneStop /> : <AiFillPlayCircle />}
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