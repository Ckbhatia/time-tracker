import { toast } from "react-toastify";
import { DEFAULT_TOAST_DURATION } from '../constants';

// Temp store descriptionQueue for ref
const descriptionQueue = [];

const tost = (
  type,
  description,
  duration = DEFAULT_TOAST_DURATION,
  position = "bottom-right",
) => {
  if (!descriptionQueue.includes(description)) {
    toast[type](description, {
      position,
      autoClose: duration,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: false,
      onClose: () => {
        // Find & remove the message from messageQueue
        const index = descriptionQueue.indexOf(description);
        descriptionQueue.splice(index, 1);
      },
    });
    // Push to messageQueue
    descriptionQueue.push(description);
  }
};

export default tost;
