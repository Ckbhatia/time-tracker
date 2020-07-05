import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";

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
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// Graphql mutation
const createOneTag = gql`
  mutation($name: String!) {
    insert_tags_one(object: { name: $name }) {
      id
      name
    }
  }
`;

const TagForm = ({ open, setOpen }) => {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const [inputValue, updateInputValue] = useState("");

  const [createATag, { data }] = useMutation(createOneTag);

  const submitTagData = () => {
    createATag({
      variables: {
        name: inputValue,
      },
    });
    // Reset
    updateInputValue("");
    // Set modal
    setOpen(!open);
  };

  return (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Create new Tag</h2>
      <input
        className="tag-input"
        name="create-tag"
        type="text"
        value={inputValue}
        onChange={(e) => updateInputValue(e.target.value)}
      />
      <button className="create-btn" onClick={() => submitTagData()}>
        Create
      </button>
    </div>
  );
};

export default TagForm;
