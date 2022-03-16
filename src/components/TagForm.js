import React, { useState } from "react";
import get from "lodash/get";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { StyledButton, StyledHeading, StyledInput } from "./TagForm.styles";
import { createOneTag } from "../service";
import { AuthContext } from "../Context/AuthContext";
import { SUCCESS_TEXT, INFO_TEXT, ERROR_TEXT, ERROR_MESSAGE } from "../constants";
import tost from "../utils/toast";

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


const TagForm = ({ refetch, handleSave }) => {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const [inputValue, updateInputValue] = useState("");
  const { userInfo } = React.useContext(AuthContext);

  const [createATag, { data, loading, error, reset } ] = useMutation(createOneTag);

  if(data && !loading) {
    tost(SUCCESS_TEXT, "Tag created successfully");
    const title = get(data, 'insert_tags_one.title', null);
    const tagId = get(data, 'insert_tags_one.id', null);
    if(title) {
      handleSave(title, tagId)
    }
    refetch();
    reset();
  }

  if(!data && loading) {
    tost(INFO_TEXT, "Creating tag...");
    reset();
  }

  if (error) {
    tost(ERROR_TEXT, ERROR_MESSAGE);
    reset();
  }

  const submitTagData = async (e) => {
    e.preventDefault();

    if(inputValue && inputValue?.trim()) {
      await createATag({
        variables: {
          title: inputValue?.trim(),
          author_id: userInfo?.userId,
        },
      });

      // Reset
      updateInputValue("");
    }
  };

  return (
    <div style={modalStyle} className={classes.paper}>
      <StyledHeading>Create tag</StyledHeading>
      <form onSubmit={submitTagData}>
        <StyledInput
          name="create-tag"
          type="text"
          value={inputValue}
          placeholder="Tag title"
          onChange={(e) => updateInputValue(e.target.value)}
          />
        <StyledButton disabled={loading} className="create-btn">
          Create
        </StyledButton>
      </form>
    </div>
  );
};

export default TagForm;
