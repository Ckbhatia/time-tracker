import moment from "moment";

export const tasksByTime = (data) => {
  if(data && data?.tasks?.length) {
    return data.tasks.reduce((acc, task) => {
      const startTime = moment.utc(task?.start_time).local().format('ll');
      if(!acc[startTime]) {
        acc[startTime] = [task];
      } else {
        acc[startTime].push(task);
      }
      return acc;
    }, {});
  }

  return {};
}