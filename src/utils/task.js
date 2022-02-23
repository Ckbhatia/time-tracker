import moment from "moment";
import { getDurationTime } from "./dateTime";

export const tasksByTime = (data) => {
  if(data && data?.tasks?.length) {
    return data.tasks.reduce((acc, task) => {
      const startTime = moment.utc(task?.start_time).local().format('ll');
      const { hours, minutes, seconds } = getDurationTime(task.start_time, task.end_time);
      if(!acc[startTime]) {
        acc[startTime] = { tasks: [task], totalTime: { totalHours: hours, totalMinutes: minutes, totalSeconds: seconds }};
      } else {
        let { totalHours, totalMinutes, totalSeconds } = acc[startTime]['totalTime'];
        totalHours += hours;
        totalMinutes += minutes;
        totalSeconds += seconds;

        if(totalSeconds > 59) {
          totalMinutes +=  1;
        }
        if(totalMinutes > 59) {
          totalHours +=  1;
        }

        acc[startTime]["tasks"].push(task);
        acc[startTime]["totalTime"] = { totalHours, totalMinutes, totalSeconds };
      }
      return acc;
    }, {});
  }
  
  return {};
}