import moment from "moment";

/* Simplifies the date to AM/PM time only
 *	param {object}
 *	return {string}
 */
 export const SimplifyTime = (date) => {
	if (date) {
		return moment.utc(date).local().format("hh:mm A");
	}
};


export const getCurrentTime = () => {
	return moment.utc().format();
};


/**
 * Takes object date time & optional boolean & returns time
 * @param {object} startTime
 * @param {object} endTime
 * @returns
 */
export const getDurationTime = (startTime, endTime) => {
  if ((!startTime || !endTime) && typeof startTime !== 'object') return null;

  const res = moment(endTime).diff(moment(startTime));

  let { days, hours, minutes, seconds } = moment.duration(res)._data;

  if (days < 0) {
    days = 0;
  }

  if (hours < 0) {
    hours = 0;
  }

  if (minutes < 0) {
    minutes = 0;
  }

  if (seconds < 0) {
    seconds = 0;
  }

  return { days, hours, minutes, seconds };
};

/**
 * Takes following param and returns formatted time ( pre-fix 0 if input number is less than 10)
 * @param {number} time 
 * @returns {number}
 */
export const getFormattedTime = (time) => {
  return time < 10 ? `0${time}` : time;
}