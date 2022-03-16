import React from "react";
import Modal from "@material-ui/core/Modal";
import TagForm from "./TagForm";

export default function SimpleModal(props) {
  const { open, setOpen, refetch, autoSelectTag } = props;

  const handleClose = () => {
    autoSelectTag()
    setOpen(false);
  };

  const handleSave = (tagTitle, tagId) => {
    autoSelectTag(tagTitle, tagId);
    setOpen(false);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <TagForm
         refetch={refetch} handleSave={handleSave} />
      </Modal>
    </div>
  );
}
