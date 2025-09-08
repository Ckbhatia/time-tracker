import React from "react";
import Modal from "@material-ui/core/Modal";

export default function SimpleModal(props) {
  const { open, handleClose } = props;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {props.children}
      </Modal>
    </div>
  );
}
