import React, { useState, useEffect } from "react";
import { useQuery, useMutation, NetworkStatus } from "@apollo/client";
import get from "lodash/get";
import { MdDelete } from "react-icons/md";
import tost from "../../utils/toast"
import CreateTag from "../Tag/CreateTag";
import { SimplifyTime, getDurationTime, getFormattedTime } from "../../utils/dateTime";
import {
  StyledButtonContainer,
  StyledDateTime,
  StyledExtraInfoContainer,
  StyledHeaderContainer,
  StyledListContainer,
  StyledMainContainer,
  StyledTagContainer,
  StyledTaskContainer,
  StyledTaskInputContainer,
  StyledTaskMainInfoContainer,
  StyledTimeContainer,
  StyledTimeDifferenceContainer,
  StyledTotalTimeContainer,
} from "./Styles";
import { tasksByTime } from "../../utils/task";
import {
  deleteOneTask,
  GetTasks,
  updateOneTaskTag,
  updateTaskTitle,
} from "../../service";
import Pagination from "../Pagination";
import { DEFAULT_LIMIT, ERROR_MESSAGE, ERROR_TEXT, INFO_TEXT, SUCCESS_TEXT } from "../../constants";
import { AuthContext } from "../../Context/AuthContext";

const TaskShow = ({ shouldRefetch, udpateShouldRefetch }) => {
  const [editTaskInfo, setEditTaskInfo] = useState();
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const { userInfo } = React.useContext(AuthContext);

  const { loading, error, data, refetch, networkStatus } = useQuery(GetTasks, {
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: DEFAULT_LIMIT,
      offset,
      author_id: userInfo?.userId,
    },
  });


  if(!data && loading) {
    tost(INFO_TEXT, "Loading tasks...");
  }

  if(networkStatus === NetworkStatus.loading) {
    tost(SUCCESS_TEXT, "Loaded tasks successfully");
  }

  if (networkStatus === NetworkStatus.refetch) {
    tost(SUCCESS_TEXT, "Re-fetch tasks successfully");
  }

  if (networkStatus === NetworkStatus.fetchMore) {
    tost(SUCCESS_TEXT, "Fetched more tasks successfully");
  }


  if (error) {
    tost(ERROR_TEXT, ERROR_MESSAGE);
  }

  React.useEffect(() => {
    if (data) {
      const aggregate = data?.tasks_aggregate?.aggregate;
      setTotalItems(aggregate?.count);
    }
  }, [data]);

  const [
    deleteAtask,
    { data: delMutData, loading: delMutLoading, error: deleteATaskError, reset: resetDeleteTask },
  ] = useMutation(deleteOneTask);


  if(delMutData && !delMutLoading) {
    tost(SUCCESS_TEXT, "Deleted a task successfully");
    resetDeleteTask();
  }

  if(!delMutData && delMutLoading) {
    tost(INFO_TEXT, "Deleting a task...");
    resetDeleteTask();
  }

  if (deleteATaskError) {
    tost(ERROR_TEXT, "Delete a task failed");
    resetDeleteTask();
  }

  const [
    updateATaskTag,
    { data: updateTaskTagData, loading: loadingTaskTag, error: updateTaskTagError, reset: resetUpdateTaskTag },
  ] = useMutation(updateOneTaskTag);

  if(updateTaskTagData && !loadingTaskTag) {
    tost(SUCCESS_TEXT, "Updated a task's tag successfully");
    resetUpdateTaskTag();
  }

  if(!updateTaskTagData && loadingTaskTag) {
    tost(INFO_TEXT, "Updating a task's tag...");
    resetUpdateTaskTag();
  }

  if (updateTaskTagError) {
    tost(ERROR_TEXT, "Update a task's tag failed");
    resetUpdateTaskTag();
  }

  const [
    updateATaskTitle,
    { data: updateATaskTitleData, loading: updateATaskTitleLoading, error: updateTaskTitleMutError,  reset: resetUpdateTaskTitle },
  ] = useMutation(updateTaskTitle);

  if(updateATaskTitleData && !updateATaskTitleLoading) {
    tost(SUCCESS_TEXT, "Updated a task's title successfully");
    resetUpdateTaskTitle();
  }

  if(!updateATaskTitleData && updateATaskTitleLoading) {
    tost(INFO_TEXT, "Updating a task's title...");
    resetUpdateTaskTitle();
  }

  if (updateTaskTitleMutError) {
    tost(ERROR_TEXT, "Update a task's title failed");
    resetUpdateTaskTitle();
  }

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
      setEditTaskInfo({
        fieldName: e.target.name,
        id: taskId,
        value: e.target.value,
      });
    } else if (e.target.name === editTaskInfo?.fieldName) {
      setEditTaskInfo({ ...editTaskInfo, value: e.target.value });
    }
  };

  const tasks = tasksByTime(data);

  const getTaskInputValue = (task) => {
    if (editTaskInfo) {
      if (editTaskInfo.fieldName === `task-title-${task.id}`) {
        return editTaskInfo.value;
      }
    }
    return task.title;
  };

  const handleBlur = async () => {
    if (editTaskInfo) {
      await updateATaskTitle({
        variables: {
          id: editTaskInfo.id,
          title: editTaskInfo.value,
        },
      });

      setEditTaskInfo(null);
    }
  };

  const handleNext = () => {
    if (offset + DEFAULT_LIMIT <= totalItems) {
      setOffset((offset) => offset + DEFAULT_LIMIT);
    }
  };

  const handlePrev = () => {
    // if(offset - DEFAULT_LIMIT >= DEFAULT_LIMIT) {
    setOffset(() => offset - DEFAULT_LIMIT);
    // }
  };

  return (
    <StyledMainContainer>
      <div className="task-list-container">
        {!loading && data?.tasks?.length
          ? Object.keys(tasks)?.map((date) => {
              const tHours = get(
                tasks,
                `[${date}].totalTime.totalHours`,
                0
              );
              const tMinutes = get(
                tasks,
                `[${date}].totalTime.totalMinutes`,
                0
              );
              const tSeconds = get(
                tasks,
                `[${date}].totalTime.totalSeconds`,
                0
              );

              const totalHours = getFormattedTime(tHours);
              const totalMinutes = getFormattedTime(tMinutes);
              const totalSeconds = getFormattedTime(tSeconds);

              return (
                <StyledListContainer key={date}>
                  <StyledHeaderContainer>
                    <StyledDateTime>{date}</StyledDateTime>
                    <StyledTotalTimeContainer>
                      <span>Total:</span>
                      <span>
                        {`${totalHours}:${totalMinutes}:${totalSeconds}`}
                      </span>
                    </StyledTotalTimeContainer>
                  </StyledHeaderContainer>
                  {tasks[date]?.tasks?.map((task) => {
                    const { hours, minutes, seconds } = getDurationTime(
                      task.start_time,
                      task.end_time
                    );
                    const hrs = getFormattedTime(hours);
                    const mins = getFormattedTime(minutes);
                    const secs = getFormattedTime(seconds);
                    return (
                      <li key={task.id} value={task.name} data-id={task.id}>
                        <StyledTaskContainer
                          onClick={(e) => {
                            updateCurrentTaskId(
                              Number(e?.currentTarget?.parentNode?.dataset?.id)
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
                                updateTagId={() => {}}
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
                              {hrs}:{mins}:{secs}
                            </StyledTimeDifferenceContainer>
                            <StyledButtonContainer>
                              <button onClick={() => submitTaskData(task.id)}>
                                <MdDelete />
                              </button>
                            </StyledButtonContainer>
                          </StyledExtraInfoContainer>
                        </StyledTaskContainer>
                      </li>
                    );
                  })}
                </StyledListContainer>
              );
            })
          : null}
      </div>
      <Pagination
        offset={offset}
        limit={DEFAULT_LIMIT}
        totalItems={totalItems}
        onClickNext={handleNext}
        onClickPrev={handlePrev}
      />
    </StyledMainContainer>
  );
};
export default TaskShow;
