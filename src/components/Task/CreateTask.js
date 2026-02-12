import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/client";
import Tag from "../Tag/Tag";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsFillStopCircleFill } from "react-icons/bs";
import { getCurrentTime } from "../../utils/dateTime";
import {
  StyledCreateTaskInput,
  StyledMainTaskContainer,
  StyledTaskContainer,
} from "./Styles";
import {
  createOneTask,
  deleteOneTask,
  GetActiveDraftTask,
  updateDraftTask,
} from "../../service";
import { AuthContext } from "../../Context/AuthContext";
import tost from "../../utils/toast";
import {
  ERROR_MESSAGE,
  ERROR_TEXT,
  SUCCESS_TEXT,
} from "../../constants";

const formatTimer = (secondsCount) => {
  const total = Math.max(secondsCount, 0);
  const seconds = total % 60;
  const minutes = Math.floor(total / 60) % 60;
  const hours = Math.floor(total / 3600);

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const CreateTask = ({ udpateShouldRefetch }) => {
  const [title, setTitle] = useState("");
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [tagId, setTagId] = useState(null);
  const [draftTaskId, setDraftTaskId] = useState(null);
  const [draftStartTime, setDraftStartTime] = useState(null);
  const [isResumedDraft, setIsResumedDraft] = useState(false);

  const intervalRef = useRef(null);
  const { userInfo } = React.useContext(AuthContext);
  const { userId } = userInfo || { userId: null };

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refetchOnUpdate = useCallback(() => {
    udpateShouldRefetch(true);
  }, [udpateShouldRefetch]);

  const resetDraftState = useCallback(() => {
    clearTimerInterval();
    setTimerRunning(false);
    setTimer("00:00:00");
    setTitle("");
    setTagId(null);
    setDraftTaskId(null);
    setDraftStartTime(null);
    setIsResumedDraft(false);
  }, [clearTimerInterval]);

  const startTimerWithOffset = useCallback(
    (offsetSeconds = 0) => {
      clearTimerInterval();
      setTimer(formatTimer(offsetSeconds));
      setTimerRunning(true);

      let totalSeconds = offsetSeconds;
      intervalRef.current = setInterval(() => {
        totalSeconds += 1;
        setTimer(formatTimer(totalSeconds));
      }, 1000);
    },
    [clearTimerInterval]
  );

  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  const [
    createAtask,
    { loading: createDraftLoading },
  ] = useMutation(createOneTask, {
    onCompleted: ({ insert_time_tracker_tasks_one }) => {
      const draft = insert_time_tracker_tasks_one;
      setDraftTaskId(draft?.id || null);
      setDraftStartTime(draft?.start_time || null);
      setIsResumedDraft(false);
      startTimerWithOffset(0);
    },
    onError: () => {
      tost(ERROR_TEXT, ERROR_MESSAGE);
    },
  });

  const [
    updateADraftTask,
    { loading: updateDraftLoading },
  ] = useMutation(updateDraftTask, {
    onCompleted: () => {
      tost(SUCCESS_TEXT, "Task saved successfully");
      resetDraftState();
      refetchOnUpdate();
    },
    onError: () => {
      tost(ERROR_TEXT, ERROR_MESSAGE);
      if (draftStartTime) {
        const elapsedSeconds = Math.max(
          moment().diff(moment(draftStartTime), "seconds"),
          0
        );
        startTimerWithOffset(elapsedSeconds);
      }
    },
  });

  const [
    deleteADraftTask,
    { loading: deleteDraftLoading },
  ] = useMutation(deleteOneTask, {
    onCompleted: () => {
      tost(SUCCESS_TEXT, "Draft task discarded");
      resetDraftState();
    },
    onError: () => {
      tost(ERROR_TEXT, "Discard draft failed");
    },
  });

  useQuery(GetActiveDraftTask, {
    skip: !userId,
    fetchPolicy: "network-only",
    variables: {
      author_id: userId,
    },
    onCompleted: (queryData) => {
      const draft = queryData?.time_tracker_tasks?.[0];
      if (!draft?.id || !draft?.start_time) {
        return;
      }

      const elapsedSeconds = Math.max(
        moment().diff(moment(draft.start_time), "seconds"),
        0
      );

      setDraftTaskId(draft.id);
      setDraftStartTime(draft.start_time);
      setIsResumedDraft(true);
      setTagId(draft.tag_id || null);
      setTitle(draft.title === "Draft" ? "" : draft.title || "");
      startTimerWithOffset(elapsedSeconds);
    },
    onError: () => {
      tost(ERROR_TEXT, "Failed to load active draft");
    },
  });

  const startTimer = useCallback(async () => {
    if (!userId || createDraftLoading || updateDraftLoading || deleteDraftLoading) {
      return;
    }

    const startTime = getCurrentTime();

    await createAtask({
      variables: {
        title: "Draft",
        start_time: startTime,
        end_time: null,
        tag_id: null,
        author_id: userId,
      },
    });
  }, [
    createAtask,
    createDraftLoading,
    deleteDraftLoading,
    updateDraftLoading,
    userId,
  ]);

  const stopTimer = useCallback(async () => {
    if (!tagId) {
      tost(ERROR_TEXT, "Please select a tag");
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      tost(ERROR_TEXT, "Please type a title");
      return;
    }

    if (!draftTaskId) {
      tost(ERROR_TEXT, "No active draft task found");
      return;
    }

    clearTimerInterval();
    setTimerRunning(false);

    await updateADraftTask({
      variables: {
        id: draftTaskId,
        title: trimmedTitle,
        end_time: getCurrentTime(),
        tag_id: tagId,
      },
    });
  }, [
    clearTimerInterval,
    draftTaskId,
    tagId,
    title,
    updateADraftTask,
  ]);

  const discardDraft = useCallback(async () => {
    if (!draftTaskId || deleteDraftLoading) {
      return;
    }

    const shouldDiscard = window.confirm(
      "Discard this draft timer entry permanently?"
    );

    if (!shouldDiscard) {
      return;
    }

    await deleteADraftTask({
      variables: {
        id: draftTaskId,
      },
    });
  }, [deleteADraftTask, deleteDraftLoading, draftTaskId]);

  const handleClick = () => {
    isTimerRunning ? stopTimer() : startTimer();
  };

  const isActionDisabled =
    createDraftLoading || updateDraftLoading || deleteDraftLoading;

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
            <Tag updateTagId={setTagId} currentTag={tagId} />
            <button
              className="timer-button"
              onClick={handleClick}
              disabled={isActionDisabled}
            >
              <span>
                {isTimerRunning ? <BsFillStopCircleFill /> : <AiFillPlayCircle />}
              </span>
            </button>
            <div className="timer-container">
              <span className="timer">{timer}</span>
            </div>
            {isResumedDraft && isTimerRunning ? (
              <button
                className="timer-button"
                onClick={discardDraft}
                disabled={isActionDisabled}
                type="button"
              >
                Discard
              </button>
            ) : null}
          </div>
        </StyledTaskContainer>
      </StyledMainTaskContainer>
    </main>
  );
};

export default CreateTask;
