import moment from "moment";
import { getDurationTime } from "./dateTime";

export const tasksByTime = (data) => {
  if(data && data?.time_tracker_tasks?.length) {
    return data.time_tracker_tasks.filter((task) => task?.end_time).reduce((acc, task) => {
      const startTime = moment.utc(task?.start_time).local().format('ll');
      const { days, hours, minutes, seconds } = getDurationTime(task.start_time, task.end_time);
      if(!acc[startTime]) {
        acc[startTime] = { tasks: [task], totalTime: { totalHours: (days || 0) * 24 + hours, totalMinutes: minutes, totalSeconds: seconds }};
      } else {
        let { totalHours, totalMinutes, totalSeconds } = acc[startTime]['totalTime'];

        totalHours += (days || 0) * 24 + hours;
        totalMinutes += minutes;
        totalSeconds += seconds;

        totalMinutes += Math.floor(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        acc[startTime]["tasks"].push(task);
        acc[startTime]["totalTime"] = { totalHours, totalMinutes, totalSeconds };
      }
      return acc;
    }, {});
  }
  
  return {};
}
