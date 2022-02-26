import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import { StyledButton, StyledHeading, StyledInput } from "./TagForm.styles";
import { createOneTag } from "../service";
import { getUserId } from "../utils/storage";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: '#13191b',
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: '#c5d2d9'
  },
}));


const TagForm = ({ open, setOpen, refetch }) => {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const [inputValue, updateInputValue] = useState("");

  const [createATag ] = useMutation(createOneTag);

  const submitTagData = async () => {
    await createATag({
      variables: {
        title: inputValue,
        author_id: getUserId()
      },
    });
    // Refetch after
    refetch();
    // Reset
    updateInputValue("");
    // Set modal
    setOpen(!open);
  };

  return (
    <div style={modalStyle} className={classes.paper}>
      <StyledHeading>Create tag</StyledHeading>
      <StyledInput
        name="create-tag"
        type="text"
        value={inputValue}
        placeholder="Tag title"
        onChange={(e) => updateInputValue(e.target.value)}
      />
      <StyledButton className="create-btn" onClick={() => submitTagData()}>
        Create
      </StyledButton>
    </div>
  );
};

export default TagForm;
