import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/client";
import Tag from "../Tag/Tag";
import { FiMoreVertical } from "react-icons/fi";
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
  updateDraftTaskProgress,
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

const getLocalDateValue = () => moment().format("YYYY-MM-DD");
const getLocalTimeValue = (time = moment()) => time.format("HH:mm");

const CreateTask = ({ udpateShouldRefetch }) => {
  const [title, setTitle] = useState("");
  const [taskMode, setTaskMode] = useState("timer");
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [tagId, setTagId] = useState(null);
  const [draftTaskId, setDraftTaskId] = useState(null);
  const [draftStartTime, setDraftStartTime] = useState(null);
  const [manualDate, setManualDate] = useState(getLocalDateValue);
  const [manualStartTime, setManualStartTime] = useState(getLocalTimeValue);
  const [manualEndTime, setManualEndTime] = useState(() =>
    getLocalTimeValue(moment().add(30, "minutes"))
  );
  const [, setIsResumedDraft] = useState(false);

  const intervalRef = useRef(null);
  const draftSyncTimeoutRef = useRef(null);
  const draftMenuRef = useRef(null);
  const lastSyncedDraftRef = useRef({ title: "Draft", tag_id: null });
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isDiscardConfirmOpen, setDiscardConfirmOpen] = useState(false);
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

  const clearDraftSyncTimeout = useCallback(() => {
    if (draftSyncTimeoutRef.current) {
      clearTimeout(draftSyncTimeoutRef.current);
      draftSyncTimeoutRef.current = null;
    }
  }, []);

  const resetDraftState = useCallback(() => {
    clearDraftSyncTimeout();
    clearTimerInterval();
    setIsDraftMenuOpen(false);
    setDiscardConfirmOpen(false);
    setTimerRunning(false);
    setTimer("00:00:00");
    setTitle("");
    setTagId(null);
    setDraftTaskId(null);
    setDraftStartTime(null);
    setIsResumedDraft(false);
    lastSyncedDraftRef.current = { title: "Draft", tag_id: null };
  }, [clearDraftSyncTimeout, clearTimerInterval]);

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
      clearDraftSyncTimeout();
      clearTimerInterval();
    };
  }, [clearDraftSyncTimeout, clearTimerInterval]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!draftMenuRef.current?.contains(event.target)) {
        setIsDraftMenuOpen(false);
        setDiscardConfirmOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [
    createAtask,
    { loading: createDraftLoading },
  ] = useMutation(createOneTask, {
    onCompleted: ({ insert_time_tracker_tasks_one }) => {
      const draft = insert_time_tracker_tasks_one;
      setTaskMode("timer");
      setDraftTaskId(draft?.id || null);
      setDraftStartTime(draft?.start_time || null);
      setIsResumedDraft(false);
      lastSyncedDraftRef.current = {
        title: draft?.title || "Draft",
        tag_id: draft?.tag_id || null,
      };
      startTimerWithOffset(0);
    },
    onError: () => {
      tost(ERROR_TEXT, ERROR_MESSAGE);
    },
  });

  const [
    createManualTask,
    { loading: createManualLoading },
  ] = useMutation(createOneTask, {
    onCompleted: () => {
      tost(SUCCESS_TEXT, "Task saved successfully");
      setTitle("");
      setTagId(null);
      setManualDate(getLocalDateValue());
      setManualStartTime(getLocalTimeValue());
      setManualEndTime(getLocalTimeValue(moment().add(30, "minutes")));
      setIsDraftMenuOpen(false);
      setDiscardConfirmOpen(false);
      refetchOnUpdate();
    },
    onError: () => {
      tost(ERROR_TEXT, ERROR_MESSAGE);
    },
  });

  const [
    syncDraftProgress,
  ] = useMutation(updateDraftTaskProgress);

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
      setTaskMode("timer");
      setIsResumedDraft(true);
      setTagId(draft.tag_id || null);
      setTitle(draft.title === "Draft" ? "" : draft.title || "");
      lastSyncedDraftRef.current = {
        title: draft.title || "Draft",
        tag_id: draft.tag_id || null,
      };
      startTimerWithOffset(elapsedSeconds);
    },
    onError: () => {
      tost(ERROR_TEXT, "Failed to load active draft");
    },
  });

  useEffect(() => {
    if (!isTimerRunning || !draftTaskId) {
      return;
    }

    const syncTitle = title.trim() ? title : "Draft";
    const syncTagId = tagId || null;
    const lastSynced = lastSyncedDraftRef.current;

    if (lastSynced.title === syncTitle && lastSynced.tag_id === syncTagId) {
      return;
    }

    clearDraftSyncTimeout();
    draftSyncTimeoutRef.current = setTimeout(async () => {
      try {
        await syncDraftProgress({
          variables: {
            id: draftTaskId,
            title: syncTitle,
            tag_id: syncTagId,
          },
        });
        lastSyncedDraftRef.current = {
          title: syncTitle,
          tag_id: syncTagId,
        };
      } catch (_) {}
    }, 400);
  }, [
    clearDraftSyncTimeout,
    draftTaskId,
    isTimerRunning,
    syncDraftProgress,
    tagId,
    title,
  ]);

  const startTimer = useCallback(async () => {
    if (
      !userId ||
      createDraftLoading ||
      createManualLoading ||
      updateDraftLoading ||
      deleteDraftLoading
    ) {
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
    createManualLoading,
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

    clearDraftSyncTimeout();
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
    clearDraftSyncTimeout,
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

    setDiscardConfirmOpen(false);
    setIsDraftMenuOpen(false);
    clearDraftSyncTimeout();
    await deleteADraftTask({
      variables: {
        id: draftTaskId,
      },
    });
  }, [clearDraftSyncTimeout, deleteADraftTask, deleteDraftLoading, draftTaskId]);

  const openDiscardConfirm = useCallback(() => {
    if (!draftTaskId || deleteDraftLoading) {
      return;
    }

    setIsDraftMenuOpen(false);
    setDiscardConfirmOpen(true);
  }, [deleteDraftLoading, draftTaskId]);

  const switchTaskMode = useCallback(
    (nextMode) => {
      if (nextMode === taskMode) {
        setIsDraftMenuOpen(false);
        return;
      }

      if (isTimerRunning && taskMode === "timer") {
        return;
      }

      setTaskMode(nextMode);
      setIsDraftMenuOpen(false);
      setDiscardConfirmOpen(false);
    },
    [isTimerRunning, taskMode]
  );

  const saveManualEntry = useCallback(async () => {
    if (
      !userId ||
      createDraftLoading ||
      createManualLoading ||
      updateDraftLoading ||
      deleteDraftLoading
    ) {
      return;
    }

    if (!tagId) {
      tost(ERROR_TEXT, "Please select a tag");
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      tost(ERROR_TEXT, "Please type a title");
      return;
    }

    if (!manualDate || !manualStartTime || !manualEndTime) {
      tost(ERROR_TEXT, "Please select date, start time and end time");
      return;
    }

    const startLocal = moment(
      `${manualDate} ${manualStartTime}`,
      "YYYY-MM-DD HH:mm",
      true
    );
    const endLocal = moment(
      `${manualDate} ${manualEndTime}`,
      "YYYY-MM-DD HH:mm",
      true
    );

    if (!startLocal.isValid() || !endLocal.isValid()) {
      tost(ERROR_TEXT, "Invalid date/time selection");
      return;
    }

    if (!endLocal.isAfter(startLocal)) {
      tost(ERROR_TEXT, "End time must be after start time");
      return;
    }

    await createManualTask({
      variables: {
        title: trimmedTitle,
        start_time: startLocal.utc().format(),
        end_time: endLocal.utc().format(),
        tag_id: tagId,
        author_id: userId,
      },
    });
  }, [
    createDraftLoading,
    createManualLoading,
    createManualTask,
    deleteDraftLoading,
    manualDate,
    manualEndTime,
    manualStartTime,
    tagId,
    title,
    updateDraftLoading,
    userId,
  ]);

  const handlePrimaryAction = () => {
    setIsDraftMenuOpen(false);
    setDiscardConfirmOpen(false);

    if (taskMode === "manual") {
      saveManualEntry();
      return;
    }

    isTimerRunning ? stopTimer() : startTimer();
  };

  const isActionDisabled =
    createDraftLoading ||
    createManualLoading ||
    updateDraftLoading ||
    deleteDraftLoading;

  const isTimerMode = taskMode === "timer";
  const inputPlaceholder = isTimerMode
    ? "What are you working on?"
    : "What have you worked on?";

  return (
    <main className="main-create-task">
      <StyledMainTaskContainer>
        <StyledTaskContainer>
          <div className="task-form-container">
            <form
              className="task-form"
              onSubmit={(e) => {
                e.preventDefault();
                handlePrimaryAction();
              }}
            >
              <StyledCreateTaskInput
                type="text"
                className="task_input"
                name="title"
                placeholder={inputPlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </form>
          </div>

          <div className="task-action-container">
            <div className="task-action-segment task-project-segment">
              <Tag
                updateTagId={setTagId}
                currentTag={tagId}
                placeholder="Project"
                compactWhenEmpty
                flatTrigger
              />
            </div>
            {isTimerMode ? (
              <>
                <div className="task-action-segment timer-container">
                  <span className="timer">{timer}</span>
                </div>
                <button
                  className={`primary-action-button${
                    isTimerRunning ? " stop-action-button" : ""
                  }`}
                  onClick={handlePrimaryAction}
                  disabled={isActionDisabled}
                  type="button"
                >
                  {isTimerRunning ? "STOP" : "START"}
                </button>
              </>
            ) : (
              <>
                <div className="task-action-segment manual-time-fields">
                  <input
                    className="manual-time-input"
                    type="time"
                    value={manualStartTime}
                    onChange={(e) => setManualStartTime(e.target.value)}
                    disabled={isActionDisabled}
                  />
                  <span className="manual-time-separator">-</span>
                  <input
                    className="manual-time-input"
                    type="time"
                    value={manualEndTime}
                    onChange={(e) => setManualEndTime(e.target.value)}
                    disabled={isActionDisabled}
                  />
                </div>
                <div className="task-action-segment manual-date-group">
                  <input
                    className="manual-date-input"
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    disabled={isActionDisabled}
                  />
                </div>
                <button
                  className="primary-action-button manual-add-button"
                  onClick={handlePrimaryAction}
                  disabled={isActionDisabled}
                  type="button"
                >
                  ADD
                </button>
              </>
            )}
            {(isTimerMode ? !isTimerRunning || Boolean(draftTaskId) : true) ? (
              <div className="draft-menu-container" ref={draftMenuRef}>
                <button
                  className="timer-button draft-menu-trigger"
                  onClick={() => {
                    setDiscardConfirmOpen(false);
                    setIsDraftMenuOpen((open) => !open);
                  }}
                  disabled={isActionDisabled}
                  type="button"
                  aria-label="Task actions"
                >
                  <FiMoreVertical />
                </button>
                {isDraftMenuOpen ? (
                  <div className="draft-menu-dropdown">
                    {isTimerMode && isTimerRunning ? (
                      <button
                        className="draft-menu-item draft-menu-item-discard"
                        onClick={openDiscardConfirm}
                        disabled={isActionDisabled}
                        type="button"
                      >
                        Discard
                      </button>
                    ) : (
                      <button
                        className="draft-menu-item"
                        onClick={() =>
                          switchTaskMode(isTimerMode ? "manual" : "timer")
                        }
                        disabled={isActionDisabled}
                        type="button"
                      >
                        {isTimerMode ? "Manual mode" : "Timer mode"}
                      </button>
                    )}
                  </div>
                ) : null}
                {isDiscardConfirmOpen && isTimerMode && isTimerRunning ? (
                  <div className="discard-confirm-overlay-panel">
                    <span className="discard-confirm-text">Are you sure?</span>
                    <button
                      className="discard-confirm-button"
                      onClick={discardDraft}
                      disabled={isActionDisabled}
                      type="button"
                    >
                      DISCARD
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </StyledTaskContainer>
      </StyledMainTaskContainer>
    </main>
  );
};

export default CreateTask;
